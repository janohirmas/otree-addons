from otree.api import *


doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'FriendlyChecks'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    bCalibrate = True
    bRequireFS = False
    bCheckFocus = True


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    dDP_cal = models.FloatField()

# FUNCTIONS 

def FriendlyChecksBeforeNextPage(player,sPagename,Varnames={'iFS':'iFS','iFL':'iFL','dFT':'dFT','dDP':'dDP'}):
    p = player.participant 
    if C.bRequireFS:
        tryExcept4FChecks(player,Varnames,'iFS',sPagename) # number of fullscreens switches
    if C.bCheckFocus:
        tryExcept4FChecks(player,Varnames,'iFL',sPagename) # number of fullscreens switches
        tryExcept4FChecks(player,Varnames,'dFT',sPagename) # number of fullscreens switches

def tryExcept4FChecks(player,Varnames,sVarname,sPagename):
    p = player.participant
    exec(f'''
try: p.{Varnames[sVarname]} += player.{Varnames[sVarname]}_{sPagename}
except KeyError: p.{Varnames[sVarname]} = player.{Varnames[sVarname]}_{sPagename}
    ''')
    exec(f"print(p.{Varnames[sVarname]})")
    
def dict4FriendlyChecks(player,sPageName, fullscreen = False, focus = False, Calibrate = False):
    sendDict = dict(
        bRequireFS = fullscreen,
        bCheckFocus = focus,
        sBodyID = 'page-content',
        bCalibrate = Calibrate,
        Varnames = {
                'iFS':f'iFS_{sPageName}',
                'iFL':f'iFL_{sPageName}',
                'dFT':f'dFT_{sPageName}',
                'dDP':f'dDP_{sPageName}',
        }
    )

    try: sendDict['dPixelRatio'] =player.participant.dPixelRatio
    except: pass 

    return sendDict


# PAGES
class BasicPage(Page):

    @staticmethod
    def is_displayed(player: Player):
        return not player.participant.bTimeOut
        

class Setup(Page):
    form_model = 'player'
    form_fields = [ 'dDP_cal' ]

    @staticmethod
    def js_vars(player: Player):
        return dict4FriendlyChecks(player,'cal',Calibrate=True,focus=True)
        

    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        player.participant.dPixelRatio = player.dDP_cal

page_sequence = [Setup]
