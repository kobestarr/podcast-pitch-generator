import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createGHLContact } from '@/lib/ghl';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

      // Send verification code via Resend
      try {
        const { error } = await resend.emails.send({
          from: 'Podcast Pitch Generator <onboarding@resend.dev>', // Using Resend's test domain for now
          to: email,
          subject: 'Your Podcast Pitch Generator Verification Code',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #00b4a0 0%, #003d4f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Podcast Pitch Generator</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                  <h2 style="color: #003d4f; margin-top: 0;">Your Verification Code</h2>
                  <p>Enter this code to unlock all pitch variations and follow-up templates:</p>
                  <div style="background: white; border: 2px solid #00b4a0; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                    <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #003d4f; font-family: 'Courier New', monospace;">
                      ${code}
                    </div>
                  </div>
                  <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
                  </p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                    This email was sent by Podcast Pitch Generator. You're receiving this because you requested a verification code.
                  </p>
                </div>
              </body>
            </html>
          `,
          text: `Your Podcast Pitch Generator Verification Code\n\nEnter this code to unlock all pitch variations:\n\n${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
        });

        if (error) {
          console.error('Resend error:', error);
          // Still return success in dev mode with code, but log the error
          return NextResponse.json({
            success: true,
            message: 'Verification code sent to your email',
            // In development, still return code if email fails
            code: process.env.NODE_ENV === 'development' ? code : undefined,
            error: process.env.NODE_ENV === 'development' ? `Email send failed: ${error.message}` : undefined,
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Verification code sent to your email',
          // Only return code in development for testing
          code: process.env.NODE_ENV === 'development' ? code : undefined,
        });
      } catch (error: any) {
        console.error('Failed to send verification email:', error);
        // In development, still return code for testing
        return NextResponse.json({
          success: true,
          message: 'Verification code sent to your email',
          code: process.env.NODE_ENV === 'development' ? code : undefined,
          error: process.env.NODE_ENV === 'development' ? `Email send failed: ${error.message}` : undefined,
        });
      }
    }

    if (action === 'verify') {
      const { code, formData } = body;

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

      // Code is valid - remove it
      verificationCodes.delete(email.toLowerCase());

      // Sync contact to GHL (don't block verification if this fails)
      if (formData) {
        try {
          await createGHLContact(email, formData);
          console.log('GHL contact created successfully for:', email);
        } catch (error: any) {
          // Log error but don't fail verification
          console.error('GHL sync failed (verification still succeeds):', error);
          // Continue - verification succeeds even if GHL fails
        }
      }

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
