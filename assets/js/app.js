const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const img = './assets/img/cd2.png'
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const state = $('header h4')
const playlist = $('.playlist')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdm: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    songs: [
        {
            name: 'Nevada',
            author: 'Vicetone',
            path: 'https://aredir.nixcdn.com/NhacCuaTui924/Nevada-Vicetone-4494556.mp3?st=_IjpS9u0LjapNgzm058wVw&e=1623143773',
            img: 'https://i.pinimg.com/originals/f8/6f/33/f86f3378e656883b33594f06d78d1634.jpg',
        },
        {
            name: 'Light It Up',
            author: 'Robin Hustin x TobiMorrow',
            path: 'https://aredir.nixcdn.com/NhacCuaTui968/LightItUp-RobinHustinTobimorrowJex-5619031.mp3?st=kzpVQ5kKnf2LlcAqM6lnxg&e=1623143881',
            img: 'https://avatar-ex-swe.nixcdn.com/song/2019/01/08/1/3/d/a/1546913843457_640.jpg',
        },
        {
            name: 'Waiting For Love',
            author: 'Avicii',
            path: 'https://aredir.nixcdn.com/Unv_Audio45/WaitingForLove-Avicii-4203283.mp3?st=mXGv6kIqbxg_coAyUqzlnw&e=1623144462',
            img: 'https://i.ytimg.com/vi/Hmbm3G-Q444/maxresdefault.jpg',
        },
        {
            name: "When I Was Your Man",
            author: "Bruno Mars",
            img: img,
            path: 'assets/music/song1.mp3'
        },
        {
            name: "Mood",
            author: "24kGoldn ft.Iann Dior",
            img: img,
            path: 'assets/music/song2.mp3'
        },
        {
            name: "Something Just Like This",
            author: "The Chainsmokers & Coldplay",
            img: img,
            path: 'assets/music/song3.mp3'
        },
        {
            name: "2AM",
            author: 'Justatee & BigDaddy',
            img: 'assets/img/2am.jpg',
            path: 'assets/music/song4.mp3'
        },
        {
            name: "Crying over you",
            author: 'Justatee & Binz',
            img: img,
            path: 'assets/music/song5.mp3'
        },

    ],
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this // gán _this = app 
        //Xử lý phóng to thu nhỏ 
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }
        //Xử lý đĩa Cd quay 
        const CdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }],
            {
                duration: 23000,
                iterations: Infinity
            }

        )
        CdThumbAnimate.pause()
        //Xử lý khi nhấn nút play
        const playBtn = $('.btn.btn-toggle-play')
        const player = $('.player')
        playBtn.onclick = function () {
            _this.isPlaying ? audio.pause() : audio.play()
        }

        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            CdThumbAnimate.play()


        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            CdThumbAnimate.pause()

        }
        const progress = $('.progress')
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercentage = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercentage


            }
        }
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {

                _this.nextSong()
            }
            audio.play()

            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {

                _this.prevSong()
            }
            audio.play()

            _this.scrollToActiveSong()


        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)

        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {

                nextBtn.click()
            }
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat

            repeatBtn.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)
        }
        playlist.onclick = (e => {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.i)
                    _this.loadCurrentSong()

                    audio.play()
                }
                //Xu ly khi click vao song option
                if (e.target.closest('.option')) {

                }
            }
        })

    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-i="${index}">
                <div class="thumb"
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.author}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        randomBtn.classList.toggle('active', this.isRandom)

        repeatBtn.classList.toggle('active', this.isRepeat)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path

        if ($('.song.active')) {
            $('.song.active').classList.remove('active')
        }
        const listSong = $$('.song')
        listSong.forEach(song => {
            if (Number(song.dataset.i) === this.currentIndex) {
                song.classList.add('active')
            }
        })

    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)

        } while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            if (this.currentIndex <= 3) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',

                })
            }

        }, 500)
    },

    start: function () {
        //Gan cau hinh config vao object
        this.loadConfig()
        //Định nghĩa các thuộc tính cho object
        this.defineProperties()
        //Lắng nghe , xử lý các sự kiện
        this.handleEvents()

        //Render ra danh sách bài hát
        this.render()
        this.loadCurrentSong()



    }

}
app.start()
