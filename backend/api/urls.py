from django.urls import path

from api.views.profile.login import login_view
from api.views.profile.rfid_card_login import rfid_login_view
from api.views.profile.update_password import update_password

from api.views.cards.add_cards import card_create
from api.views.cards.list_cards import card_list
from api.views.cards.delete_cards import card_delete
from api.views.cards.delete_all_cards import card_delete_all

from api.views.cards.check_card_status import check_card
from api.views.cards.deactivate_card import deactivate_card
from api.views.cards.activate_card import reactivate_card

from api.views.cards.autodeactivate_cards import autodeactivate_cards
from api.views.cards.deactivate_all_cards import deactivate_all_cards

from api.views.logs.create_log import create_log
from api.views.logs.list_log import list_logs
from api.views.logs.delete_log import delete_logs

from api.views.weekly_stats import weekly_deactivated_cards

urlpatterns = [
    path('login/', login_view, name='login'),
    path('rfid_login/', rfid_login_view, name='rfid_login'),
    path('update-password/', update_password, name='update_password'),
    
    path('create-cards/', card_create, name='Create Card'),
    path('list-cards/', card_list, name='List Cards'),
    path('delete-card/<str:card_id>/', card_delete, name='Delete Card'),
    path('delete-all-card/', card_delete_all, name='Delete All Cards'),

    path('check-status/<str:card_id>/', check_card, name='check_card'),
    path('deactivate/<str:card_id>/', deactivate_card, name='deactivate_card'),
    path('deactivate_all_cards/', deactivate_all_cards, name='all_cards_deactivate'),
    path('autodeactivate_cards/', autodeactivate_cards, name='deactivate_all_cards'),
    path('activate/<str:card_id>/', reactivate_card, name='activate_card'),
    
    path('create-logs/', create_log, name='card-logs'),
    path('list-logs/', list_logs, name='list-logs'),
    path('delete-logs/', delete_logs, name='delete-logs'),

    path('weekly-clients/', weekly_deactivated_cards, name='weekly_deactivated_cards'),
]

