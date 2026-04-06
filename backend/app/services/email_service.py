import resend
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Resend
resend.api_key = settings.RESEND_API_KEY


async def send_welcome_email(to_email: str, name: str = "User") -> bool:
    """Send welcome email to new users."""
    try:
        params = {
            "from": f"{settings.APP_NAME} <{settings.RESEND_FROM_EMAIL}>",
            "to": to_email,
            "subject": f"Welcome to {settings.APP_NAME}! 🎉",
            "html": f"""
            <h1>Welcome to {settings.APP_NAME}!</h1>
            <p>Hi {name},</p>
            <p>Thank you for joining {settings.APP_NAME}. We're excited to have you on board!</p>
            <p>Here's what you can do next:</p>
            <ul>
                <li>Complete your profile</li>
                <li>Explore our features</li>
                <li>Upgrade to a premium plan for more features</li>
            </ul>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The {settings.APP_NAME} Team</p>
            """,
        }
        
        email = resend.Emails.send(params)
        logger.info(f"Welcome email sent to {to_email}")
        return True
    
    except Exception as e:
        logger.error(f"Error sending welcome email to {to_email}: {str(e)}")
        return False


async def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """Send password reset email."""
    try:
        reset_url = f"https://yourapp.com/reset-password?token={reset_token}"
        
        params = {
            "from": f"{settings.APP_NAME} <{settings.RESEND_FROM_EMAIL}>",
            "to": to_email,
            "subject": f"Reset your {settings.APP_NAME} password",
            "html": f"""
            <h1>Password Reset Request</h1>
            <p>Hi,</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <p><a href="{reset_url}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,<br>The {settings.APP_NAME} Team</p>
            """,
        }
        
        email = resend.Emails.send(params)
        logger.info(f"Password reset email sent to {to_email}")
        return True
    
    except Exception as e:
        logger.error(f"Error sending password reset email to {to_email}: {str(e)}")
        return False


async def send_subscription_confirmation_email(to_email: str, plan: str) -> bool:
    """Send subscription confirmation email."""
    try:
        params = {
            "from": f"{settings.APP_NAME} <{settings.RESEND_FROM_EMAIL}>",
            "to": to_email,
            "subject": f"Subscription Confirmed - {plan} Plan",
            "html": f"""
            <h1>Subscription Confirmed! 🎉</h1>
            <p>Hi,</p>
            <p>Your subscription to the <strong>{plan}</strong> plan has been confirmed.</p>
            <p>You now have access to all {plan} features:</p>
            <ul>
                <li>✅ Unlimited projects</li>
                <li>✅ Priority support</li>
                <li>✅ Advanced analytics</li>
                <li>✅ Custom integrations</li>
            </ul>
            <p>Manage your subscription anytime from your account settings.</p>
            <p>Best regards,<br>The {settings.APP_NAME} Team</p>
            """,
        }
        
        email = resend.Emails.send(params)
        logger.info(f"Subscription confirmation email sent to {to_email}")
        return True
    
    except Exception as e:
        logger.error(f"Error sending subscription confirmation email to {to_email}: {str(e)}")
        return False
