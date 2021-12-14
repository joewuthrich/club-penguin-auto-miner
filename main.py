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
    listener = keyboard.Listener(
    on_release=self.stopLoop)
    listener.start()

    maxX = max(self._pos1[0], self._pos2[0])  
    minX = min(self._pos1[0], self._pos2[0])
    maxY = max(self._pos1[1], self._pos2[1])
    minY = min(self._pos1[1], self._pos2[1])
    currentPos = self._pos2
    while self._loop:
        boundsX = int(currentPos[0] - 45), int(currentPos[0] + 45)
        boundsY = int(currentPos[1] - 35), int(currentPos[1] + 65)
        innerX = int(currentPos[0] - 30), int(currentPos[0] + 30)
        innerY = int(currentPos[1] - 20), int(currentPos[1] + 50)
        newPos = random.randint(*boundsX), random.randint(*boundsY)

        while newPos[0] < minX or newPos[0] > maxX or newPos[0] == currentPos[0] or \
          newPos[1] < minY or newPos[1] > maxY or newPos[1] == currentPos[1] or \
            innerX[0] < newPos[0] < innerX[1] or innerY[0] < newPos[1] < innerY[1]:
          newPos = random.randint(*boundsX), random.randint(*boundsY)
        
        currentPos = newPos
        print("Moving to " + str(currentPos))
        mouseController.position = currentPos
        mouseController.click(Button.left)
        time.sleep(random.uniform(0.6, 1.2))
        keyboardController.tap("d")
        time.sleep(random.uniform(5, 5.5))

  def stopLoop(self, key):
    if key == keyboard.Key.esc:
      print("Stopping automatic loop.")
      self._loop = False
      return False

main = Main()
main.setCoordinates()
