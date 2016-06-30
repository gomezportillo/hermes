#!/usr/bin/env python
# -*- coding:utf-8; tab-width:4 -*-

import os
import sys

try:
    import gobject
    import gtk
except Exception as e:
    print('GTK Not Available: {}'.format(e))
    sys.exit(1)

class HermesApp:

    def __init__(self):
        self.buildGUI()

    def buildGUI(self):
        gladefile = os.path.join('glade', 'hermes.glade')
        self.builder = gtk.Builder()
        self.builder.add_from_file(gladefile)
        #image = self.builder.get_object('logo-image')
        image = gtk.Image()
        image.set_from_file('hermes-logo-title.png')
        image.show()

        gtk.Frame().add(image)
        
        handlers = {
        #    "solve_gymkhana_button_clicked": self.solve_gymkhana,
        #    "menu_quit": self.exit,
        #    "menu_about": self.show_about,
        }

        self.builder.connect_signals(handlers)
        self.window = self.builder.get_object("main_window")
        self.window.connect('destroy', gtk.main_quit)
        self.window.show()

    def show_about(self, button):
        gtk_window_set_modal()
        self.dialog = gtk.AboutDialog()
        self.dialog.set_name("Hermes")
        self.dialog.set_authors(['\nC:TED'])
        self.dialog.run()
        self.dialog.destroy()

    def exit(self, button):
        sys.exit(0)

gui = HermesApp()
gtk.main()
