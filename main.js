    let $ = document.querySelector.bind(document)
    let $$ = document.querySelectorAll.bind(document)

    let PLAY_KEY = 'Long'
    let cd = $('.img-list')
    let headName = $('.headName')
    let imgList = $('.img-list')
    let audio = $('#audio')
    let btnplay=$('.btn-toggle-play')
    let pause=$('.icon-pause')
    let start=$('.icon-play')
    let linerun = $('#progress')
    let btnprev = $('.btn-prev')
    let btnnext = $('.btn-next')
    let btnRd =$('.btn-random')
    let btnrepeat = $('.btn-repeat')
    let playlist = $('.playlist')
    let btnupvolumn =$('.btn-volume-up')
    let btndownvolumn =$('.btn-volume-down')
    let app={
        curentIndex:0,
        isPlaying:false,
        isRandom:false,
        isRepeat:false,
        config: JSON.parse(localStorage.getItem(PLAY_KEY)) || {},
        setConfig: function(key,value){
            this.config[key] = value
            localStorage.setItem(PLAY_KEY,JSON.stringify(this.config))
        },
        loadConfig: function(){
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat
        }, 
            songs:[
                {
                name:'À Lôi',
                singer:'Double 2T',
                path:'./music/A-Loi-Double2T-Masew.mp3',
                img:'./img/aloi.jpg'
                },
                {
                    name:'Buồn của anh',
                    singer:'Đạt G / Masew',
                    path:'./music/Buon-Cua-Anh-K-ICM-Dat-G-Masew.mp3',
                    img:'./img/bca.jpg'
                },
                {
                    name:'Em là hoàng hôn vàng',
                    singer:'Cloud',
                    path:'./music/Em-La-Hoang-Hon-Vang-Cloud-5.mp3',
                    img:'./img/elhh.jpg'
                },
                {
                    name:'Thích quá rùi nà',
                    singer:'TLinh',
                    path:'./music/Thich-Qua-Rui-Na-tlinh-Trung-Tran-Wxrdie-MCK-Phongkhin.mp3',
                    img:'./img/tlinh.jpg'
                },
                {
                    name:'Phai dấu cuộc tình (Remix)',
                    singer:'DJ WuLong',
                    path:'./music/PhaiDauCuocTinhRemixTbynzRemix-DJ-9873699.mp3',
                    img:'./img/pdct.jpg'
                },
                {
                    name:'Gosting (Remix)',
                    singer:'Lê Bảo',
                    path:'./music/GhostingLeBaoRemix-LinhKa-9541355.mp3',
                    img:'./img/g.jpg'
                },
                {
                    name:'Khuất Lối (Remix)',
                    singer:'Cloud',
                    path:'./music/KhuatLoiNessRemix-HKray-9873706.mp3',
                    img:'./img/kl.jpg'
                },
                {
                    name:'Waiting For You',
                    singer:'Mono',
                    path:'./music/WaitingForYou-MONOOnionn-7733882.mp3',
                    img:'./img/wtfy.jpg'
                },
            ],
        scrollevent: function(){
            let _this = this
            let cdWidth = cd.offsetWidth
            let rounding = imgList.animate([
                {transform: 'rotate(360deg)'}
            ],{
                duration:10000,
                iterations: Infinity
            })
            rounding.pause();
            document.onscroll=function(){
                let scrollTop = window.scrollY || document.documentElement.scrollTop
                let newWidth = (cdWidth - scrollTop)
                cd.style.width = newWidth >0 ? newWidth +'px': 0
                cd.style.opacity= cdWidth/100
            }
            btnplay.onclick=function(){
                if(_this.isPlaying){
                    audio.pause();
                }
                else{
                    audio.play();
                }

                // khi nhạc phát
                audio.onplay=function(){
                    _this.isPlaying=true
                    pause.style.display='block'
                    start.style.display='none'
                    rounding.play()

                }
                // Khi pause nhạc
                audio.onpause=function(){
                    _this.isPlaying=false
                    pause.style.display='none'
                    start.style.display='block'
                    rounding.pause()
                }
                // Thời gian chạy theo nhạc
                audio.ontimeupdate= function(){
                    if(audio.duration){
                        let percent = Math.floor(audio.currentTime/audio.duration *100)
                        linerun.value=percent
                    }
                }
                linerun.onchange=function(event){
                    let time = audio.duration / 100 * linerun.value
                    audio.currentTime = time
                }
            }
            btnnext.onclick = function(){
                if(_this.isRandom){
                    _this.randomSong()
                    audio.play()
                }
                else{
                    _this.nextSong();
                    audio.play();
                }
                _this.render()
                _this.scrolltoActiveSong()
            }
            btnprev.onclick = function(){
                if(_this.isRandom){
                    _this.randomSong()
                    audio.play()
                }
                else{
                    _this.prevSong();
                    audio.play();
                }
                _this.render()
                _this.scrolltoActiveSong()
            }
            btnRd.onclick=function(){
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom',_this.isRandom)
                btnRd.classList.toggle('active',_this.isRandom)
            }
            btnrepeat.onclick=function(){
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat',_this.isRepeat)
                btnrepeat.classList.toggle('active',_this.isRepeat)
            }
            audio.onended = function(){
                if(_this.isRepeat){
                    _this.repeatsong()
                    audio.play()
                }
                else{
                    btnnext.onclick()
                }
            }
            playlist.onclick=function(e){
                let listNode = e.target.closest('.song:not(.active)')
                if(listNode || e.target.closest('.option')){
                    if(listNode){
                        _this.curentIndex = Number(listNode.dataset.index)
                        _this.loadcurrentSong()
                        _this.render()
                        audio.play()
                    }
                }
            }
            btnupvolumn.onclick = function(){
                if(audio.volume <= 1){
                    audio.volume += 0.05
                }
            }
            btndownvolumn.onclick = function(){
                if(audio.volume >=0){
                    audio.volume -= 0.05
                }
            }
        },
        repeatsong:function(){
            let repeat = this.curentIndex
            this.curentIndex = repeat
            this.loadcurrentSong()
        },
        randomSong: function(){
            let newIndex
           do{ 
            newIndex = Math.floor(Math.random()*this.songs.length)
            }
            while(newIndex === this.curentIndex)
            this.curentIndex = newIndex
            this.loadcurrentSong()
        },
        nextSong: function(){
            this.curentIndex ++
            if(this.curentIndex>= this.songs.length){
                this.curentIndex = 0
            }
            this.loadcurrentSong()
        },
        prevSong: function(){
            this.curentIndex --;
            if(this.curentIndex<0){
                this.curentIndex = this.songs.length-1;
            }
            this.loadcurrentSong()
        },

        scrolltoActiveSong: function(){
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior:'smooth',
                    block:'center'
                })
            },200)
        },
        defineProperties: function(){
            Object.defineProperty(this,'curentSong',{
                get:function(){
                    return this.songs[this.curentIndex]
                }
            })
        },
        render: function(){
            let html = this.songs.map((song,index)=>{
                return`
                <div data-index="${index}" class="song ${index === this.curentIndex ? 'active' : ''}">
                <div class="thumb">
                <img src="${song.img}" alt="" class="">
                </div>
                <div class="body">
                    <h4 class="title">${song.name}</h4>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa fa-ellipsis"></i>
                </div>
            </div>`
            })
            $('.playlist').innerHTML = html.join('')
        },
        loadcurrentSong: function(){
            headName.textContent=this.curentSong.name
            imgList.src =this.curentSong.img
            audio.src =this.curentSong.path 

            console.log(audio,headName,imgList)
        },

        start: function(){
            // lấy ra list nhạc
            this.loadConfig()

            this.render()
            // xác định thuộc tính cho object
            this.defineProperties()
            // tải bài hát đầu tiên khi load web
            this.loadcurrentSong()
            // thu nhỏ img album khi cuộn list nhạc
            this.scrollevent()

            btnRd.classList.toggle('active',this.isRandom)
            btnrepeat.classList.toggle('active',this.isRepeat)
        }
    }
    app.start()