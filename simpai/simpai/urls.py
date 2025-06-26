from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from summarisation.views import FileUploadView, AskQuestionsView as pdprompt, SummarizeView, GPTChatView
from spreadsheet.views import SpreadsheetUploadView, AnalyzeDataView, GenerateChartView
from gpt.views import AskGPTView
from . import views
from auth.views import login_view, register_view
from profiles import urls
from subscriptions import views as sub_views
from checkouts import views as checkout_views
from landing import views as landing_views
#from allauth.account.views import confirm_email as allauthemailconf
from profiles.views import confirm_email, resend_confirmation_email
from dj_rest_auth.views import PasswordResetView
from django.contrib.auth import views as auth_views
from profiles.views import PasswordResetRequestView, PasswordResetConfirmView
from django.views.decorators.csrf import csrf_exempt
from allauth.account.views import PasswordResetView
from profiles.views import request_password_reset, verify_reset_token, reset_password
from spreadsheet.views import AskQuestionView
from customers.views import UserProfileView
from subscriptions.views import check_subscription_status
from helpers.views import paystack_webhook

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landing_views.landing_page_view, name='home'),
    path('auth/', include('allauth.urls')),
    #path("api/auth/registration/account-confirm-email/<str:key>/", allauthemailconf, name="account_confirm_email"),
    #path("api/auth/registration/account-confirm-email/<str:key>/", confirm_email, name="account_confirm_email"),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/resend-confirmation-email/', resend_confirmation_email, name='resend_confirmation_email'),
    path("auth/password/reset/", csrf_exempt(PasswordResetView.as_view()), name="account_reset_password"),
    path('api/auth/password/reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api/auth/password/reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/auth/password/reset/confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/auth/password/reset/complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api/checkout/sub-price/<int:price_id>/', checkout_views.product_price_redirect_view, name="sub-price-checkout"),
    path('checkout/start/', checkout_views.checkout_redirect_view, name='stripe-checkout-start'),
    path('api/subscription-prices/', sub_views.subscription_price_view, name='subscription-prices'),
    path('api/checkout/finalize/', checkout_views.checkout_finalize_view, name='checkout-finalize'),

    path('paystack/webhook/', paystack_webhook, name='paystack-webhook'),

    path('api/check-subscription-status/', check_subscription_status, name='check-sub-status'),

    path('accounts/', include('allauth.urls')),
    path('api/confirm-email/', confirm_email, name='account_confirm_email'),
    path('resend-confirmation-email/', resend_confirmation_email, name='resend_confirmation_email'),
    path('api/password-reset/request/', request_password_reset, name='request_password_reset'),
    path('api/password-reset/verify/<str:token>/', verify_reset_token, name='verify_reset_token'),
    path('api/password-reset/reset/<str:token>/', reset_password, name='reset_password'),
    #path('send-confirmation-email/', send_confirmation_email, name='send_confirmation_email'),

    path("api/profile/", UserProfileView.as_view(), name="get_user_profile"),

    #path("login/", login_view, name="login"),
    #path("register/", register_view, name="register"),
    path('pricing/', sub_views.subscription_price_view, name='pricing'),
    path("profiles/", include('profiles.urls')),
    path('checkout/sub_price/<int:price_id>/', checkout_views.product_price_redirect_view, name="sub-price-checkout"),
    path("checkout/start", checkout_views.checkout_redirect_view,
         name='stripe-checkout-start'),
    path("checkout/success", checkout_views.checkout_finalize_view,
         name="stripe-checkout-end"),
    path('accounts/billing', sub_views.user_subscription_view, name='user_subscription'),
    path('accounts/billing/cancel/', sub_views.user_subscription_cancel_view, name="user_subscription_cancel"),

    path('csv/upload/', SpreadsheetUploadView.as_view(), name='upload_spreadsheet'),
    path('csv/analyze/', AnalyzeDataView.as_view(), name='analyze_data'),
    path('csv/chart/', GenerateChartView.as_view(), name='generate_chart'),
    path('csv/', views.spreadsheet_view, name='spreadsheet'),
    path('csv/ask/', AskQuestionView.as_view(), name='ask-question'),

    path('gpt/ask/', AskGPTView.as_view(), name='ask_gpt'),
    path('gpt-chat/', GPTChatView.as_view(), name="gpt-chat"),
    
    #path('summarisation/', views.index, name='index'),
    #path('summarisation/pdf_features/', TemplateView.as_view(template_name='pdf_features.html'), name='pdf-features'),
    path('summarisation/ask/', pdprompt.as_view(), name='ask-question'),
    path('summarisation/upload/', FileUploadView.as_view(), name='file-upload'),
    path('summarisation/summarize/', SummarizeView.as_view(), name='summarize'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)