from pathlib import Path
import os
from urllib.parse import urljoin
from decouple import config


BASE_DIR = Path(__file__).resolve().parent.parent


FRONTEND_URL = config("FRONTEND_URL")
BACKEND_URL = config("BASE_URL", default=None)
LOGIN_URL = urljoin(FRONTEND_URL, '/login')
PASSWORD_RESET_TIMEOUT = 604800


DEEPSEEK_API_KEY = config('DEEPSEEK_API_KEY')
DATABASE_URL = config('DATABASE_URL', default=None)

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config("EMAIL_HOST", cast=str, default=None)
EMAIL_PORT = config("EMAIL_PORT", cast=str, default='587')
EMAIL_HOST_USER = config("EMAIL_HOST_USER", cast=str, default=None)
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", cast=str, default=None)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool, default=True)
EMAIL_USE_SSL = config("EMAIL_USE_SSL", cast=bool, default=False)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
TEMP_DIR = os.path.join(MEDIA_ROOT, 'temp')

DATA_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024  # 20MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024  # 20MB

SECRET_KEY = 'django-insecure-klh^+(_78yw90o5rw%t_hkh7v%$#roox3dz)&3zqnmq2syc7w)'

DEBUG = True
BASE_URL = config("BASE_URL", default=None)
MY_HOST = config("MY_HOST", default=None)
ALLOWED_HOSTS = ["127.0.0.1", "localhost", MY_HOST]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    # 'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    #'django_rest_auth',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'summarisation',
    'spreadsheet',
    'django_extensions',
    'corsheaders',
    'gpt',
    'allauth',
    'allauth.account',
    "allauth.socialaccount",
    'allauth.socialaccount.providers.google',
    # 'allauth.socialaccount.providers.microsoft',
    # 'allauth.socialaccount.providers.apple',
    "widget_tweaks",
    "commando",
    "profiles",
    'helpers',
    'customers',
    'subscriptions',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',  # Optional, for browsable API
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

EMAIL_CONFIRMATION_URL = urljoin(FRONTEND_URL, '/confirm-email/{key}')
PASSWORD_RESET_CONFIRM = urljoin(FRONTEND_URL, '/reset-password-confirm/{uid}/{token}/')

REST_AUTH = {
    'USE_JWT': False,
    'TOKEN_MODEL': 'rest_framework.authtoken.models.Token',
    'LOGIN_SERIALIZER': 'dj_rest_auth.serializers.LoginSerializer',
    'REGISTER_SERIALIZER': 'profiles.serializers.CustomRegisterSerializer',
    'EMAIL_CONFIRMATION_URL': EMAIL_CONFIRMATION_URL,
    'PASSWORD_RESET_CONFIRM': PASSWORD_RESET_CONFIRM,
}

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
    BACKEND_URL,
]

PASSWORD_RESET_TIMEOUT = 86400  # Token valid for 24 hours

CSRF_COOKIE_NAME = "csrftoken"

SESSION_COOKIE_SECURE = False  # Set to True in production
CSRF_COOKIE_SECURE = True 

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()

CORS_ALLOW_CREDENTIALS = True


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = 'simpai.urls'
APP_NAME = "simpai"
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'simpai.wsgi.application'


DATABASE_URL = config("DATABASE_URL", default=None)

if DATABASE_URL is not None:
    import dj_database_url
    DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=30,
        conn_health_checks=True
        )
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LOGIN_REDIRECT_URL = "/"
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED=True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_VERIFICATION="mandatory"
ACCOUNT_EMAIL_SUBJECT_PREFIX = "[SIMPAI]"

ACCOUNT_ADAPTER = 'profiles.views.CustomAccountAdapter'

AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by email
    'allauth.account.auth_backends.AuthenticationBackend',
]

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'APP': {
            'client_id': config("GOOGLE_CLIENT_ID", default=""),  # Add your Google Client ID
            'secret': config("GOOGLE_CLIENT_SECRET", default=""),  # Add your Google Client Secret
            'key': '',  # Optional, for additional configuration
        }
    }
}


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
