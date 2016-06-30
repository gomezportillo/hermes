#!/usr/bin/env python
# -*- coding:utf-8; tab-width:4 -*-

import os
import sys
import socket
from string import Template

try:
    import gtk
except Exception as e:
    print('GTK Not Available: {}'.format(e))
    sys.exit(1)

class State:
    stopped = 0
    running = 1

class HermesApp:

    def __init__(self):
        self.state = State.stopped
        self.buildGUI()

    def buildGUI(self):
        gladefile = os.path.join('glade', 'hermes.glade')
        self.builder = gtk.Builder()
        self.builder.add_from_file(gladefile)

        handlers = {
            'start_server': self.start_server,
            'menu_exit': self.exit,
            'menu_about': self.show_about,
        }
        self.builder.connect_signals(handlers)

        self.builder.get_object('ip-entry').set_text(self.get_self_ip()+':8080')

        self.window = self.builder.get_object('main_window')
        self.window.connect('destroy', gtk.main_quit)
        self.window.show()

    def start_server(self, button):
        if (self.state == State.stopped):
            self.state = State.running
            button = self.builder.get_object('start-button')
            button.set_label('Detener servidor')

            url = self.builder.get_object('url-entry').get_text()
            self.set_youtube_url(url)

        else:
            self.state = State.stopped
            button = self.builder.get_object('start-button')
            button.set_label('Iniciar servidor')

    def show_about(self, button):
        self.dialog = gtk.AboutDialog()
        self.dialog.set_name('Hermes')
        self.dialog.set_authors(['Hermes es un proyecto del C:TED'])
        self.dialog.run()
        self.dialog.destroy()

    def exit(self, button):
        sys.exit(0)

    def get_self_ip(self):
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)

    def set_youtube_url(self, url):
        html_template_file = open(os.path.join('pages', 'student_template.html'))
        html_template = Template(html_template_file.read())
        updated_html_content = html_template.substitute(VIDEO_URL=url)

        update_html_file = open(os.path.join('pages', 'student.html'))
        with open(update_html_file, 'w+') as new_html_file:
            new_html_file.write(updated_html_content)


gui = HermesApp()
gtk.main()
