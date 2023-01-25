from otree.api import *
import FriendlyChecks as fc
from FriendlyChecks import BasicPage

doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'InformedConsent'
    PLAYERS_PER_GROUP   = None
    NUM_ROUNDS          = 1
    # TimeOut Seconds 
    timeout_seconds = 5*60
    # Template variables
    AvgDur              = '30'
    # Figures paths
    figUvA_logo         = 'global/figures/UvA_logo.png'
    # FS and Focus check
    bRequireFS = False
    bCheckFocus = True


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    iFL_IC = models.IntegerField()
    dFT_IC = models.FloatField()

def creating_session(subsession):
    for player in subsession.get_players():
        player.participant.bTimeOut = False

# PAGES
class Intro(BasicPage):
    form_model = 'player'
    form_fields = ['iFL_IC','dFT_IC']

    timeout_seconds = C.timeout_seconds

    @staticmethod
    def before_next_page(player, timeout_happened):
        if timeout_happened:
            # you may want to fill a default value for any form fields,
            # because otherwise they may be left null.
            player.participant.bTimeOut = True

    @staticmethod
    def js_vars(player: Player):
        return fc.dict4FriendlyChecks(player,'IC',focus=True)

page_sequence = [Intro]
