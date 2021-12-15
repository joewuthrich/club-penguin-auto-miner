from pynput import mouse, keyboard
from pynput.mouse import Button, Controller as MouseController
from pynput.keyboard import Controller as KeyboardController
import random
import time

mouseController = MouseController()
keyboardController = KeyboardController()

class Main:
  def __init__(self):
    self._pos1 = (0, 0)
    self._pos2 = (0, 0)
    self._loop = False

  def setCoordinates(self):
    print("Click and drag to select an area to mine in.")
    with mouse.Listener(on_click=self.click) as listener:
      listener.join()
    self.startLoop()
    
  def click(self, x, y, button, pressed):
    if pressed:
      self._pos1 = (x, y)
    else:
      self._pos2 = (x, y)
      print("Coordinates set at", self._pos1, "and", self._pos2)
      return False

  def startLoop(self):
    self._loop = True
    listener = keyboard.Listener(on_release = self.stopLoop)
    listener.start()

    maxX = max(self._pos1[0], self._pos2[0])  
    minX = min(self._pos1[0], self._pos2[0])
    maxY = max(self._pos1[1], self._pos2[1])
    minY = min(self._pos1[1], self._pos2[1])
    currentPos = self._pos2

    print("Starting automatic loop in two seconds.")
    time.sleep(2)
    while self._loop:
        boundsX = int(currentPos[0] - 35), int(currentPos[0] + 35)
        boundsY = int(currentPos[1] - 6), int(currentPos[1] + 55)
        innerX = int(currentPos[0] - 30), int(currentPos[0] + 30)
        innerY = int(currentPos[1] - 1), int(currentPos[1] + 50)
        newPos = random.randint(*boundsX), random.randint(*boundsY)

        while newPos[0] < minX or newPos[0] > maxX or newPos[0] == currentPos[0] or \
          newPos[1] < minY or newPos[1] > maxY or newPos[1] == currentPos[1] or \
            innerX[0] < newPos[0] < innerX[1] or innerY[0] < newPos[1] < innerY[1]:
          newPos = random.randint(*boundsX), random.randint(*boundsY)
        
        currentPos = newPos
        # print("Moving to " + str(currentPos))
        mouseController.position = currentPos
        mouseController.click(Button.left)

        time.sleep(random.uniform(0.35, 0.45))
        chance = random.random()
        if chance < 0.005:
          keyboardController.tap("s")
        elif chance < 0.01:
          keyboardController.tap("w")
        else:
          keyboardController.tap("d")
          if chance > 0.995:
            time.sleep(random.uniform(0.4, 0.7))
            keyboardController.tap("h")
            time.sleep(random.uniform(0.2, 0.4))
        time.sleep(random.uniform(3.3, 3.8))
    print("Automatic loop stopped.")

  def stopLoop(self, key):
    if key == keyboard.Key.esc:
      print("Stopping automatic loop.")
      self._loop = False
      return False

main = Main()
main.setCoordinates()

# STARTING COINS: 3866 (12:47am)
# FINISHING COINS: 50432 (11:21am) - WAS KICKED AT UNKNOWN TIME

# STARTING COINS: 74753 (1:30pm)
# FINISHING COINS: 196963 (6:11pm)

