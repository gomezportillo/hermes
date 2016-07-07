# -*- mode: python -*-

block_cipher = None


a = Analysis(['launcher.py'],
             pathex=['C:\\Users\\71722388\\Documents\\GitHub\\hermes'],
             binaries=None,
             datas=None,
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          name='launcher',
          debug=False,
          strip=False,
          upx=True,
          console=True , version='version.txt', icon='icono.ico')
