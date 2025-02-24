from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from summarisation.views import FileUploadView, AskQuestionsView, SummarizeView
from spreadsheet.views import SpreadsheetUploadView, AnalyzeDataView, GenerateChartView, AskQuestionView
from gpt.views import AskGPTView
from . import views
from auth.views import login_view, register_view
from profiles import urls
from subscriptions import views as sub_views
from checkouts import views as checkout_views
from landing import views as landing_views
#from allauth.account.views import confirm_email as allauthemailconf
from profiles.views import confirm_email, resend_confirmation_email
from profiles.views import request_password_reset


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landing_views.landing_page_view, name='home'),
    path('accounts/', include('allauth.urls')),
    #path("api/auth/registration/account-confirm-email/<str:key>/", allauthemailconf, name="account_confirm_email"),
    path("api/auth/registration/account-confirm-email/<str:key>/", confirm_email, name="account_confirm_email"),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/resend-confirmation-email/', resend_confirmation_email, name='resend_confirmation_email'),
    path('api/auth/password/reset/', request_password_reset, name='request_password_reset'),
    path('api/checkout/sub-price/<int:price_id>/', checkout_views.product_price_redirect_view, name="sub-price-checkout"),
    path('checkout/start', checkout_views.checkout_redirect_view, name='stripe-checkout-start'),
    path('api/subscription-prices/', sub_views.subscription_price_view, name='subscription-prices'),
    path('api/checkout/finalize/', checkout_views.checkout_finalize_view, name='checkout-finalize'),



    path("login/", login_view, name="login"),
    path("register/", register_view, name="register"),
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
    path('csv/ask/', AskQuestionView.as_view(), name='ask_question'),
    path('csv/', views.spreadsheet_view, name='spreadsheet'),

    #gpt
    path('gpt/ask/', AskGPTView.as_view(), name='ask_gpt'),

    #path('summarisation/', views.index, name='index'),
    #path('summarisation/pdf_features/', TemplateView.as_view(template_name='pdf_features.html'), name='pdf-features'),
    path('summarisation/ask/', AskQuestionsView.as_view(), name='ask-question'),
    path('summarisation/upload/', FileUploadView.as_view(), name='file-upload'),
    path('summarisation/summarize/', SummarizeView.as_view(), name='summarize'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)