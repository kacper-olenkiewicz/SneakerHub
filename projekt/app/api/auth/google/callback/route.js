import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=google', request.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(new URL('/login?error=google-config', request.url));
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=google-token', request.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/login?error=google-token', request.url));
    }

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=google-userinfo', request.url));
    }

    const userInfo = await userInfoResponse.json();
    const email = userInfo.email;
    const name = userInfo.name || userInfo.given_name || null;

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=google-email', request.url));
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const randomPassword = crypto.randomUUID();
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: 'USER'
        }
      });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    const sessionUser = { ...userWithoutPassword, authProvider: 'google' };
    const redirectPath = user.role === 'WORKER' ? '/worker' : '/dashboard';

    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    response.cookies.set(SESSION_COOKIE_NAME, JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.redirect(new URL('/login?error=google', request.url));
  }
}
