# build.py
# Run script to deploy local recompOs frontend/backend

import os
import shutil
from pynput import keyboard
import subprocess
import io


COMMAND_TSC = "npx tsc"

# Node process and logger needed to close it with rebuild
node_pid: subprocess.Popen = None
node_log: io.FileIO = None

# Control over listening to keys
catcher_active = True


# Call appropiate functions on specific key presses
def keyRouter(key):
    global catcher_active

    try:
        if key.char == 'r' and catcher_active:
            rebuildProject()
        elif key.char == 's' and catcher_active:
            killServer()
            exit(0)
    except AttributeError:      # Assuming that if key is not KeyCode it must be special key (Key)
        # Control of key listening
        if key == keyboard.Key.esc and catcher_active:
            print("Stopping keyboard listening")
            catcher_active = False
        elif key == keyboard.Key.esc and not catcher_active:
            print("Listening to keyboard")
            catcher_active = True


# Run typescript compiler on project
def buildAllFiles():
    os.system(f"{COMMAND_TSC} --project tsconfig.json")


# Kill and clean up after node server
def killServer():
    global node_pid
    global node_log

    if node_pid is not None:
        print("Killing old node server... ", end="")
        node_pid.kill()
        node_pid = None
        node_log.close()
        node_log = None
        print("Done")


# Rebuild the project ts and public files, and restart node server
def rebuildProject():
    print("\nRebuilding project...")

    global node_pid
    global node_log

    # Kill old server to refresh
    killServer()

    print("Rebuilding files... ", end="")
    # Remove old build data
    shutil.rmtree("build")
    # Copy the public files as new build directory
    shutil.copytree("public", "build")
    # Build files
    buildAllFiles()
    print("Done")

    # Launch new server
    print("Starting server... ", end="")
    node_log = open("server/log.txt", "w")
    node_pid = subprocess.Popen("node server/server.js", stdout=node_log)
    print("Done")

    print("Rebuilding complete\n")


# Script entry point
def main():
    print("RecompOs developement helper")
    print("Press 'r' to rebuild project and restart server")
    print("Press 's' to stop server and quit")
    print("Press 'esc' to start/stop catching input\n")
    # Pynput refresh cycle
    with keyboard.Listener(on_press=keyRouter) as listener:
        listener.join()

if __name__ == "__main__":
    main()
