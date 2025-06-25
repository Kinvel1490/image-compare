class imageComparator {
    constructor (element, options) {
        this.galery = element
        this.options = {
            staticImage: (options && options.staticImage) ?? 'compare_static_image',
            resizableImage: (options && options.resizableImage) ?? 'compare_resizable_image',
            navigation: (options && options.navigation) ?? false,
            thumbs: (options && options.thumbs) ?? false,
            resizableClass: (options && options.resizableClass) ?? 'compare_resizable',
            controllerClass: (options && options.controllerClass) ?? 'control_wrapper',
            thumbsContainer: (options && options.thumbsContainer) ?? 'compare_thmb_wrapper',
            navigationNext: (options && options.navigationNext) ?? 'compare_next',
            navigationPrev: (options && options.navigationPrev) ?? 'compare_prev',
            thumbsNavigation: (options && options.thumbsNavigation) ?? false,
            thumbsNavigationNext: (options && options.navigationNext) ?? 'thumbs_compare_next',
            thumbsNavigationPrev: (options && options.navigationPrev) ?? 'thumbs_compare_prev',
            thumbClass: (options && options.thumbClass) ?? "compare_thumb",
            thumbsCount: (options && options.thumbsCount) ?? 4,
            thumbsSpace: (options && options.thumbsSpace) ?? 15,
            thumbsPerSlide: (options && options.thumbsPerSlide) ?? 1,
            initialSlide: (options && options.initialSlide) ?? 0,
            speed: (options && options.speed) ?? 400,
            easing: (options && options.easing) ?? "ease-in"
        }
        this.thumbsContainer = this.galery.querySelector(`.${this.options.thumbsContainer}`)
        this.controller = this.galery.querySelector(`.${this.options.controllerClass}`)
        this.staticImage = this.galery.querySelector(`.${this.options.staticImage}`)
        this.resizableImage = this.galery.querySelector(`.${this.options.resizableImage}`)
        this.navigationNext = this.galery.querySelector(`.${this.options.navigationNext}`)
        this.navigationPrev = this.galery.querySelector(`.${this.options.navigationPrev}`)
        this.thumbsNavigationNext = this.galery.querySelector(`.${this.options.thumbsNavigationNext}`)
        this.thumbsNavigationPrev = this.galery.querySelector(`.${this.options.thumbsNavigationPrev}`)
        this.thumbs = Array.from(this.galery.querySelectorAll(`.${this.options.thumbClass}`))
        this.resizableElement = this.galery.querySelector(`.${this.options.resizableClass}`)
        this.maxWidth = this.staticImage.clientWidth
        this.mouseClickController = this.mouseClickController.bind(this)
        this.mouseUpController = this.mouseUpController.bind(this)
        this.mouseMoveController = this.mouseMoveController.bind(this)
        this.imageChanger = this.imageChanger.bind(this)
        this.resize = this.resize.bind(this)
        this.nextThumbs = this.nextThumbs.bind(this)
        this.prevThumbs = this.prevThumbs.bind(this)
        this.nextImage = this.nextImage.bind(this)
        this.prevImage = this.prevImage.bind(this)
        this.isInitialsed = false
        this.translate = 0
        this.isThumbScrolling = false
        this.maxActive = this.thumbs.length - this.options.thumbsCount
        this.activeThumb = this.options.initialSlide > this.maxActive ? this.maxActive : this.options.initialSlide
        this.currentSlide = this.options.initialSlide > this.thumbs.length - 1 ? this.thumbs.length - 1 : this.options.initialSlide
        this.breakpoints = (options.breakpoints && Object.keys(options.breakpoints).length > 0)? options.breakpoints : false
        this.thumbsCount = this.options.thumbsCount
        this.thumbsSpace = this.options.thumbsSpace
    }

    start (){
        let options = this.options
        if(!options.thumbs && this.thumbsContainer) {
            this.thumbsContainer.style.display = 'none'
        }
        if(!options.navigation){
            this.navigationNext && (this.navigationNext.style.display = 'none')
            this.navigationPrev && (this.navigationPrev.style.display = 'none')
        }
        if(!options.thumbsNavigation){
            this.thumbsNavigationNext && (this.thumbsNavigationNext.style.display = 'none')
            this.thumbsNavigationPrev && (this.thumbsNavigationPrev.style.display = 'none')
        }
        if(this.thumbsContainer && this.thumbs.length > 0){ // making wrapper for thumbs
            this.thumbWrapper = document.createElement('div')
            this.thumbWrapper.classList.add("compare_thumbs_slider")
            this.thumbWrapper.style.display = 'flex'
            this.thumbWrapper.style.transitionProperty = 'transform'
            this.thumbWrapper.style.transitionBehavior = `${options.easing}`
            this.thumbs.forEach(thumb=>{this.thumbWrapper.append(thumb)})
            this.thumbsContainer.prepend(this.thumbWrapper)
        }
        this.thumbsNavigationNext && this.thumbsNavigationNext.addEventListener('click', ()=>this.nextThumbs(options.thumbsPerSlide))
        this.thumbsNavigationPrev && this.thumbsNavigationPrev.addEventListener('click', ()=>this.prevThumbs(options.thumbsPerSlide))

        this.navigationNext && this.navigationNext.addEventListener('click', this.nextImage)
        this.navigationPrev && this.navigationPrev.addEventListener('click', this.prevImage)

        if(this.thumbs.length > 0) {
            this.setUpThumbs()
        }

        this.controller.addEventListener('mousedown', this.mouseClickController)
        window.addEventListener('mouseup', this.mouseUpController)
        this.resize()
        this.thumbs.length>0 && this.thumbs[this.activeThumb].classList.add('active-thumb')
        new ResizeObserver(this.resize).observe(this.galery)
        this.isInitialsed = true
    }

    resizeThumbs () {
        this.thumbs.forEach((thumb)=>{
            thumb.style.width = `${(this.galery.clientWidth - ((this.thumbsCount - 1) * this.thumbsSpace))/ this.thumbsCount}px`
            thumb.style.marginLeft = `${this.thumbsSpace}px`
        })
    }

    setThumbsSpace () {
        this.thumbs.forEach((thumb, index)=>{
            index > 0 && (thumb.style.marginLeft = `${this.thumbsSpace}px`)
        })
    }

    scrollToActiveSlide () {
        let moveStep = this.thumbs[this.activeThumb].getBoundingClientRect().x - this.galery.getBoundingClientRect().x
        this.translate -= moveStep
        this.thumbWrapper.style.transform = `translateX(${this.translate}px)`
    }

    nextThumbs (count) {
        this.thumbs[this.activeThumb].classList.remove('active-thumb')
        this.activeThumb = this.activeThumb + count > this.maxActive ? this.maxActive : this.activeThumb + count
        this.thumbs[this.activeThumb].classList.add('active-thumb')
        this.scrollSmooth()
    }

    prevThumbs (count) {
        this.thumbs[this.activeThumb].classList.remove('active-thumb')
        this.activeThumb = this.activeThumb - count < 0 ? 0 : this.activeThumb - count
        this.thumbs[this.activeThumb].classList.add('active-thumb')
        this.scrollSmooth()
    }

    scrollSmooth () {
        if(this.isThumbScrolling) return
        this.isThumbScrolling = true
        this.thumbWrapper.style.transitionDuration = `${this.options.speed}ms`
        this.scrollToActiveSlide()
        setTimeout(()=>{
            this.isThumbScrolling = false, 
            this.thumbWrapper.style.transitionDuration = "0ms"
        }, this.options.speed)
    }

    resize () {
        if(this.isInitialsed && this.resizableElement.clientWidth === this.maxWidth) return
        if(this.breakpoints){
            let widthes = Object.keys(this.breakpoints)
            for(let i = 0; i < widthes.length; i++){
                let matches = matchMedia(`(max-width: ${widthes[i]}px)`).matches
                if(matches){
                    this.breakpoints[widthes[i]].thumbsCount && (this.thumbsCount = this.breakpoints[widthes[i]].thumbsCount)
                    this.breakpoints[widthes[i]].thumbsSpace && (this.thumbsSpace = this.breakpoints[widthes[i]].thumbsSpace)
                    break
                } else {
                    this.thumbsCount = this.options.thumbsCount
                    this.thumbsSpace = this.options.thumbsSpace
                }
            }
        }
        let relation = this.resizableElement.clientWidth/this.maxWidth
        this.maxWidth = this.staticImage.clientWidth
        this.resizableImage.style.width = `${this.maxWidth}px`
        this.resizableElement.style.width = !this.resizableElement.style.width ? `${(this.maxWidth / 2).toFixed(1)}px` : `${(this.maxWidth * relation).toFixed(1)}px`
        if(this.thumbs.length>0){
            this.resizeThumbs()
            this.scrollToActiveSlide()
        }
        
    }

    setUpThumbs () {
        this.resizeThumbs()
        this.setThumbsSpace()
        this.thumbs.forEach(thumb=>{
            thumb.addEventListener('click', (e)=>this.imageChanger(e.target))
        })
        if(this.options.initialSlide > 0) {
            this.staticImage.src = this.thumbs[this.options.initialSlide].getAttribute('fullsize')
            this.resizableImage.src = this.thumbs[this.options.initialSlide].getAttribute('compare')
        }
    }

    imageChanger (elem) {
        this.staticImage.src = elem.getAttribute('fullsize')
        this.resizableImage.src = elem.getAttribute('compare')
        this.currentSlide = this.thumbs.indexOf(elem)
        this.activeThumb = this.thumbs.indexOf(elem)
        this.nextThumbs(0)
    }

    nextImage () {
        if(this.thumbs.length > 0) {
            this.nextThumbs(1)
        }
        let nextSlide = this.currentSlide < (this.thumbs.length - 1) ? this.currentSlide + 1 : this.thumbs.length -1
        this.imageChanger(this.thumbs[nextSlide])
    }

    prevImage () {
        if(this.thumbs.length > 0) {
            this.prevThumbs(1)
        }
        let nextSlide = this.currentSlide < 1 ? 0 : this.currentSlide - 1 
        this.imageChanger(this.thumbs[nextSlide])
    }

    mouseClickController () {
        window.addEventListener('mousemove', this.mouseMoveController)
    }

    mouseUpController () {
        window.removeEventListener('mousemove', this.mouseMoveController)
    }

    mouseMoveController (e){
        let width = (this.resizableElement.clientWidth + e.movementX) > this.maxWidth? this.maxWidth : this.resizableElement.clientWidth + e.movementX
        width = (this.resizableElement.clientWidth + e.movementX) < 0 ? 0 : this.resizableElement.clientWidth + e.movementX
        this.resizableElement.style.width = `${width}px`
    }
}