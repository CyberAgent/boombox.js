# Sound File


## Creation software

Sound that was created in AudioSauna

[http://www.audiosauna.com/](http://www.audiosauna.com/)

# memo

```
$ ffmpeg -i sound.wav sound.mp3
```

# Generate audio sprite files

```
$ boombox-audiosprite -o sprite -e ac3,caf,mp3,m4a,ogg ./sprite/a/*.wav
$ boombox-audiosprite -o sprite -e ac3,caf,mp3,m4a,ogg ./sprite/b/*.wav
$ boombox-audiosprite -o sprite -e ac3,caf,mp3,m4a,ogg ./sprite/c/*.wav
```

# deps

- ffmpeg
- audiosprite
- boombox-audiosprite

