from pyscript import Element, window
import time
import random

class Method:

    @staticmethod
    def add():
        n1 = random.randint(1, 200)
        n2 = random.randint(1, 200)
        while True:
            try:
                ans = int(Element(f"What is {n1} + {n2}? ").value)
                if ans == n1 + n2:
                    return True
            except ValueError:
                pass
            print("Incorrect. Try again.")

    @staticmethod
    def sub():
        n1 = random.randint(1, 200)
        n2 = random.randint(1, 200)
        if n1 < n2:
            n1, n2 = n2, n1
        while True:
            try:
                ans = int(Element(f"What is {n1} - {n2}? ").value)
                if ans == n1 - n2:
                    return True
            except ValueError:
                pass
            print("Incorrect. Try again.")

    @staticmethod
    def mul():
        n1 = random.randint(1, 15)
        n2 = random.randint(1, 15)
        while True:
            try:
                ans = int(Element(f"What is {n1} * {n2}? ").value)
                if ans == n1 * n2:
                    return True
            except ValueError:
                pass
            print("Incorrect. Try again.")

    @staticmethod
    def div():
        n1 = random.randint(1, 200)
        n2 = random.randint(1, 12)
        if n1 % n2 != 0:
            n1 += (n2 - n1 % n2)  # Ensure divisible
        while True:
            try:
                ans = int(Element(f"What is {n1} / {n2}? ").value)
                if ans == n1 // n2:
                    return True
            except ValueError:
                pass
            print("Incorrect. Try again.")

    @staticmethod
    def question():
        question_funcs = {
            1: Method.add,
            2: Method.sub,
            3: Method.mul,
            4: Method.div
        }
        choice = random.randint(1, 4)
        return question_funcs[choice]()
    
    def add_score(score):
        return score
    
    

class User:

    
    def __init__(self):
        self.name = Element("name").value
        self.score = 0

    def start_game(self):
        print("Welcome to the math game!")
        print("You have 120 seconds to answer as many questions as you can.")

        start_time = time.time()
        duration =  120 # seconds

        while time.time() - start_time < duration:
            Method.question()
            self.score += Method.add_score(1)
            print("Your score is:", self.score, "time left:", int(duration - time.time() + start_time))

        print("Time's up! Your final score is:", self.score)
        
