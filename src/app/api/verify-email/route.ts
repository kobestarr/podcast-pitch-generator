import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for verification codes (use Redis in production)
const verificationCodes = new Map<string, { code: string; email: string; expiresAt: number }>();
const CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Generate 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired codes
function cleanupExpiredCodes() {
  const now = Date.now();
  verificationCodes.forEach((value, key) => {
    if (now > value.expiresAt) {
      verificationCodes.delete(key);
    }
  });
}

// POST: Request verification code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    cleanupExpiredCodes();

    if (action === 'request') {
      // Generate and store verification code
      const code = generateCode();
      const expiresAt = Date.now() + CODE_EXPIRY;
      
      // Store code (keyed by email)
      verificationCodes.set(email.toLowerCase(), {
        code,
        email: email.toLowerCase(),
        expiresAt,
      });

      // TODO: Send email with code via email service (Resend, SendGrid, etc.)
      // For now, return code in response for testing
      // In production, remove code from response and send via email only

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email',
        // Remove this in production - code should only come via email
        code: process.env.NODE_ENV === 'development' ? code : undefined,
      });
    }

    if (action === 'verify') {
      const { code } = body;

      if (!code || typeof code !== 'string') {
        return NextResponse.json(
          { error: 'Verification code is required' },
          { status: 400 }
        );
      }

      const stored = verificationCodes.get(email.toLowerCase());

      if (!stored) {
        return NextResponse.json(
          { error: 'No verification code found. Please request a new one.' },
          { status: 404 }
        );
      }

      if (Date.now() > stored.expiresAt) {
        verificationCodes.delete(email.toLowerCase());
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new one.' },
          { status: 410 }
        );
      }

      if (stored.code !== code) {
        return NextResponse.json(
          { error: 'Invalid verification code. Please try again.' },
          { status: 400 }
        );
      }

      // Code is valid - remove it and return success
      verificationCodes.delete(email.toLowerCase());

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Email verified successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "request" or "verify"' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
