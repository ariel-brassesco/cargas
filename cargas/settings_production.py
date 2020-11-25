import os

ALLOWED_HOSTS = ['cargas-ar.herokuapp.com']

# Application definition

INSTALLED_APPS += [
    'gdstorage',
]

MIDDLEWARE += [
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
import dj_database_url
DATABASES = {
    'default':  dj_database_url.config(conn_max_age=600)
}

# Google Drive Storage Settings
GOOGLE_DRIVE_STORAGE_JSON_KEY_FILE = None
GOOGLE_DRIVE_STORAGE_JSON_KEY_FILE_CONTENTS = os.getenv('GOOGLE_DRIVE_STORAGE_JSON_KEY_FILE_CONTENTS')
GOOGLE_DRIVE_STORAGE_MEDIA_ROOT = 'cargas/media'

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# SSL Configuration
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_SAVE_EVERY_REQUEST = True # For session dictionary modifications between request

# EMAIL SETTINGS
EMAIL_HOST = os.getenv('MAILGUN_SMTP_SERVER')
EMAIL_HOST_USER = os.getenv('MAILGUN_SMTP_LOGIN')
EMAIL_HOST_PASSWORD = os.getenv('MAILGUN_SMTP_PASSWORD')
EMAIL_PORT = os.getenv('MAILGUN_SMTP_PORT')
EMAIL_USE_TLS = True
EMAIL_SENDER_CREDENTIALS = os.getenv('EMAIL_SENDER_CREDENTIALS')
EMAIL_RECEIVE_CREDENTIALS = os.getenv("EMAIL_RECEIVE_CREDENTIALS")
EMAIL_OWNER = os.getenv("EMAIL_OWNER")
MAILGUN_ACCESS_KEY = os.getenv('MAILGUN_API_KEY')
MAILGUN_SERVER_NAME = os.getenv('MAILGUN_DOMAIN')
EMAIL_BACKEND = 'django_mailgun.MailgunBackend'
