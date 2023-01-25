from otree.api import *
import FriendlyChecks as fs
import json 

doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'Questionnaire'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    # File location
    sQuestPath = '_static/global/files/questions.json'


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    D1 = models.StringField()
    D2 = models.StringField()
    D3 = models.StringField()
    D4 = models.StringField(blank=True)
    D5 = models.StringField(blank=True)
    D6 = models.StringField(blank=True)
    EQ1 = models.StringField(blank=True)
    EQ2 = models.StringField(blank=True)
    ## Friendly check variables
    iFL_Q = models.IntegerField()
    iFS_Q = models.IntegerField()
    dFT_Q = models.FloatField()



# PAGES
class Questionnaire(Page):
    form_model = 'player'
    form_fields = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 
                    'EQ1','EQ2','iFL_Q','iFS_Q','dFT_Q']

    @staticmethod
    def js_vars(player: Player):
        text_file = open(C.sQuestPath)
        data = json.load(text_file)['lQuestions']
        dictFinal = fs.dict4FriendlyChecks(player,'Q',True,True)
        dictFinal.update(lQuestions = data)
        return dictFinal

    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        fs.FriendlyChecksBeforeNextPage(player,'Q')



page_sequence = [Questionnaire]
