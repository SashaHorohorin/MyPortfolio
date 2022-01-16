// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());

/*
let block = document.querySelector('.click');
block.addEventListener("click", function (e) {
	alert('Все ок ;)');
});
*/

/*
//Объявляем переменные
const parent_original = document.querySelector('.content__blocks_city');
const parent = document.querySelector('.content__column_river');
const item = document.querySelector('.content__block_item');

//Слушаем изменение размера экрана
window.addEventListener('resize', move);

//Функция
function move(){
	const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (viewport_width <= 992) {
		if (!item.classList.contains('done')) {
			parent.insertBefore(item, parent.children[2]);
			item.classList.add('done');
		}
	} else {
		if (item.classList.contains('done')) {
			parent_original.insertBefore(item, parent_original.children[2]);
			item.classList.remove('done');
		}
	}
}

//Вызываем функцию
move();

*/

// <PICTURES>================================================================================================
function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
    
// testWebP(function (support) {
    
//     if (support == true) {
//     document.querySelector('body').classList.add('webp');
//     }else{
//     document.querySelector('body').classList.add('no-webp');
//     }
// });
// <PICTURES>================================================================================================
$('.select').each(function() {
    const _this = $(this),
        selectOption = _this.find('option'),
        selectOptionLength = selectOption.length,
        selectedOption = selectOption.filter(':selected'),
        duration = 450; // длительность анимации 

    _this.hide();
    _this.wrap('<div class="select"></div>');
    $('<div>', {
        class: 'new-select',
        text: _this.children('option:disabled').text()
    }).insertAfter(_this);

    const selectHead = _this.next('.new-select');
    $('<div>', {
        class: 'new-select__list'
    }).insertAfter(selectHead);

    const selectList = selectHead.next('.new-select__list');
    for (let i = 1; i < selectOptionLength; i++) {
        $('<div>', {
            class: 'new-select__item',
            html: $('<span>', {
                text: selectOption.eq(i).text()
            })
        })
        .attr('data-value', selectOption.eq(i).val())
        .appendTo(selectList);
    }

    const selectItem = selectList.find('.new-select__item');
    selectList.slideUp(0);
    selectHead.on('click', function() {
        if ( !$(this).hasClass('on') ) {
            $(this).addClass('on');
            selectList.slideDown(duration);

            selectItem.on('click', function() {
                let chooseItem = $(this).data('value');

                $('select').val(chooseItem).attr('selected', 'selected');
                selectHead.text( $(this).find('span').text() );

                selectList.slideUp(duration);
                selectHead.removeClass('on');
            });

        } else {
            $(this).removeClass('on');
            selectList.slideUp(duration);
        }
    });
});
$(document).ready(function(){
    $('.contact-manage__btn').click(function(){
        // if(window.innerWidth > 540){
            
        // }else{
            
        // }
        if(window.innerWidth > 1000){
            if($(this).find('i').hasClass('fa-share')){
                $(this).find('i').removeClass('fa-share');
                $(this).find('i').addClass('fa-close');
                $(this).find('i').css({'transform': 'rotate(360deg)',});
                $('ul.contact-manage__icon li a i.ig').css({
                    'top': '-55px',
                    'left': '-130px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.vk').css({
                    'top': '-140px',
                    'left': '-100px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.tw').css({
                    'top': '-55px',
                    'left': '-177px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.git').css({
                    'top': '-91px',
                    'left': '-100px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
            }
            else{
                $(this).find('i').addClass('fa-share');
                $(this).find('i').css({
                    'transform': 'rotate(0deg)',
                })
                $('ul.contact-manage__icon li a i.ig').css({
                    'top': '0px',
                    'left': '-34px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.vk').css({
                    'top': '0px',
                    'left': '-34px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.tw').css({
                    'top': '0px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.git').css({
                    'left': '-34px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
            }
        }else if(window.innerWidth <= 540){
            if($(this).find('i').hasClass('fa-share')){
                $(this).find('i').removeClass('fa-share');
                $(this).find('i').addClass('fa-close');
                $(this).find('i').css({'transform': 'rotate(360deg)',});
                $('ul.contact-manage__icon li a i.ig').css({
                    'top': '-137px',
                    'left': '-35px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.vk').css({
                    'top': '-175px',
                    'left': '-35px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.tw').css({
                    'top': '-61px',
                    'left': '-35px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.git').css({
                    'top': '-99px',
                    'left': '-35px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
            }
            else{
                $(this).find('i').addClass('fa-share');
                $(this).find('i').css({
                    'transform': 'rotate(0deg)',
                })
                $('ul.contact-manage__icon li a i.ig').css({
                    'top': '0px',
                    'left': '-34px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.vk').css({
                    'top': '0px',
                    'left': '-34px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.tw').css({
                    'top': '0px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.git').css({
                    'left': '-34px',
                    'top': '0px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
            }
        }else{
            if($(this).find('i').hasClass('fa-share')){
                $(this).find('i').removeClass('fa-share');
                $(this).find('i').addClass('fa-close');
                $(this).find('i').css({'transform': 'rotate(360deg)',});
                $('ul.contact-manage__icon li a i.ig').css({
                    'top': '-137px',
                    'left': '-60px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.vk').css({
                    'top': '-175px',
                    'left': '-60px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.tw').css({
                    'top': '-61px',
                    'left': '-60px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
                $('ul.contact-manage__icon li a i.git').css({
                    'top': '-99px',
                    'left': '-60px',
                    'transform': 'rotate(360deg)',
                    'z-index': '10',
                    'opacity': '1',
                })
            }
            else{
                $(this).find('i').addClass('fa-share');
                $(this).find('i').css({
                    'transform': 'rotate(0deg)',
                })
                $('ul.contact-manage__icon li a i.ig').css({
                    'top': '0px',
                    'left': '-34px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.vk').css({
                    'top': '0px',
                    'left': '-34px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.tw').css({
                    'top': '0px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
                $('ul.contact-manage__icon li a i.git').css({
                    'left': '-34px',
                    'top': '0px',
                    'transform': 'rotate(0deg)',
                    'z-index': '-99',
                    'opacity': '0',
                })
            }
        }
        
    })
});
var page = document.querySelector('.page');
var pagePaddingBottom = window.getComputedStyle(page, null).getPropertyValue('padding-bottom');

// <FullScreanSlider>================================================================================================

let pageSlider = new Swiper('.page__row', {
	// Свои классы 
	wrapperClass: "page__wrapper",
	slideClass: "page__screen", 
	
	// Вертикальный слайдер 
	direction: 'vartical',

	// Количество слайдов для показа
	sliderPerView: 'auto',

	// Включаем паралакс
	parallax: true,

	//Управление колесом мыши
	mousewheel: {
		sensitivity: 1,
	},

	speed: 600,

	observer: true,
	observerParents: true,
	observerSlideChildren: true,
	navigation:{
        nextEl: '.arrow-down',
        prevEl: '.arrow-up'
    },

	pagination: {
		el: '.navbar-side__points',
		type: 'bullets',
		clickable: true,
		bulletClass: "navbar-side__point",
		bulletActiveClass: "navbar-side__point_active"
	},

	init: false,
	//События 
	on: {
		// Событие инициализации 
		init: function () {
			menuSlider();
		},

		// // Событие смены слайда
		// slideChange: function () {
		// 	menuSliderRemove();
		// 	menuLinks[pageSlider.realIndex].classList.add('_active');
		// },
	},
	
})

// <FullScreanSlider>================================================================================================
// <MENU>================================================================================================

let menu_icon = document.querySelector('.burger__lines');
let menu_body = document.querySelector('.menu__body');
let body = document.querySelector('body');
menu_icon.addEventListener("click", function(e){
    //let menu_icon = document.querySelector('.header__icon');
    menu_icon.classList.toggle('_active');
    menu_body.classList.toggle('active');
    body.classList.toggle('lock');
});

// <MENU>================================================================================================


// Закрывает выплывающее меню при клике в любую часть экрана----------------------------------------------
document.documentElement.addEventListener("click", function(e){
    if(e.target.closest('.menu')){
        //let user_menu = document.querySelector('.user-header__menu');
		let menu_icon = document.querySelector('.burger__lines');
		let menu_body = document.querySelector('.menu__body');
        menu_body.classList.remove('active');
        menu_icon.classList.remove('_active');
		body.classList.toggle('lock');

    }
});
// Закрывает выплывающее меню при клике в любую часть экрана----------------------------------------------



// <Автоматический переход по слайдам, через выподающее меню>================================================================================================


let menuLinks = document.querySelectorAll(".menu__link");

function menuSlider(){
	if(menuLinks.length > 0){
		menuLinks[pageSlider.realIndex].classList.add('_active');
		for(let i = 0; i < menuLinks.length; i++){
			const menuLink = menuLinks[i];
			menuLink.addEventListener("click", function(e) {
				e.preventDefault;
				menuSliderRemove();
				pageSlider.slideTo(i, 600);
				menuLink.classList.add('_active');
				
			});
		}
	}
}

function menuSliderRemove() {
	let menuLinkActive = document.querySelector('.menu__link._active');
	if(menuLinkActive){
		menuLinkActive.classList.remove('_active');
	}
}

pageSlider.init();

// <Автоматический переход по слайдам, через выподающее меню>================================================================================================
// Плавный переход между ссылками лейдинга-----------------------------------
// $(document).ready(function(){
//     $("#menu, #menu2").on("click","a", function (event) {
//         //отменяем стандартную обработку нажатия по ссылке
// 		var pruv  = $(this).attr('href');
// 		if(pruv[0] == "#"){
// 			event.preventDefault();
        
     
// 			//забираем идентификатор бока с атрибута href
// 			var id  = $(this).attr('href'),
	
			
		 
// 			//узнаем высоту от начала страницы до блока на который ссылается якорь
// 				top = $(id).offset().top-77;
// 				console.log($(this).attr('href'));
				 
// 			//анимируем переход на расстояние - top за 1500 мс
// 			$('body,html').animate({scrollTop: top}, 1000);
// 		}
        
//     });
// });

// // Плавный переход между ссылками лейдинга-----------------------------------
// // <HOVER на ссылках>================================================================================================

// const rowWork = document.querySelector(".work-hover");

// rowWork.addEventListener("mouseenter", function(event) {
// 	console.log(event);

//     event.onmousemove = function (e) {
// 		const x = e.pageX - event.offsetLeft;
// 		const y = e.pageY - event.offsetTop;
		
// 		console.log(x, y);
		
// 		event.style.setProperty('--x', x + 'px');
// 		event.style.setProperty('--y', y + 'px');
// 	}
// 	// console.log(e);
// });
const btn = document.querySelectorAll(".work-hover");
for(let i = 0; i < btn.length; i++){
	btn[i].onmousemove = function (e) {
		const x = e.pageX - btn[i].offsetLeft;
		const y = e.pageY - btn[i].offsetTop;
	
		//console.log(x, y);
	
		btn[i].style.setProperty('--x', x + 'px');
		btn[i].style.setProperty('--y', y + 'px');
	}
}


// <HOVER на ссылках>================================================================================================






// <ADAPTIVE GRID>================================================================================================

function padding(){
	var screen = document.querySelector('.works-screen__row');
	var screenWidthStr = window.getComputedStyle(screen, null).getPropertyValue('width');
	var screenWork = document.querySelector('.works-screen__work');
	var screenWorkWidthStr = window.getComputedStyle(screenWork, null).getPropertyValue('width');
	let md1;
	let size1 = screenWidthStr.length-2;
	var screenWidth = screenWidthStr.substr(0, size1);
	let size2 = screenWorkWidthStr.length-2;
	var screenWorkWidth = screenWorkWidthStr.substr(0, size2);
	
	md1 = Number(screenWidth) - Number(screenWorkWidth) * 5;
	var md2 = Number(screenWidth) - Number(screenWorkWidth) * 4;
	var md3 = Number(screenWidth) - Number(screenWorkWidth) * 3;
	if(md1 > 0){
		let md11 = md1 / 2;
		screen.style.width = screenWidth - md1 + 5 + 'px';	
	}else if(md2 > 0){
		let md21 = md2 / 2;
		screen.style.width = screenWidth - md2 + 5 + 'px';
	}else if(md3 > 0){
		let md31 = md3 / 2;
		screen.style.width = screenWidth - md3 + 5 + 'px';
	}
	
}

padding();

// let screenWindow = document.querySelector('body');
// var screenWindowWidthStr = window.getComputedStyle(screenWindow, null).getPropertyValue('width');
// let size3 = screenWindowWidthStr.length-2;
var screenWindowWidth = window.innerWidth;

var screenWork = document.querySelectorAll('.works-screen__work');
var screenWorkWidthStr = window.getComputedStyle(screenWork[0], null).getPropertyValue('width');
let size = screenWorkWidthStr.length-2;
var screenWorkWidth2 = screenWorkWidthStr.substr(0, size);

window.addEventListener("resize", function() {
	let addSize;
	
	// var screenWork = document.querySelectorAll('.works-screen__work');
	// var screenWorkWidthStr = window.getComputedStyle(screenWork[0], null).getPropertyValue('width');
	
	// let screenWindow2 = document.querySelector('body');
	// var screenWindow2WidthStr = window.getComputedStyle(screenWindow2, null).getPropertyValue('width');
	// let size4 = screenWindow2WidthStr.length-2;
	var screenWindow2Width = window.innerWidth;
	// var screenWork = document.querySelectorAll('.works-screen__work');
	// var screenWorkWidthStr = window.getComputedStyle(screenWork[0], null).getPropertyValue('width');

	var screenWindow2Height = window.innerHeight;
	console.log(screenWindow2Height);
	var screenWork = document.querySelectorAll('.works-screen__work');
	var screenWorkWidthStr = window.getComputedStyle(screenWork[0], null).getPropertyValue('width');
	let size7 = screenWorkWidthStr.length-2;
	var screenWorkWidth2 = screenWorkWidthStr.substr(0, size7);
	
	
	let size = screenWorkWidthStr.length-2;
	var screenWorkWidth = screenWorkWidthStr.substr(0, size);
	
	//console.log("Первоначально: " + screenWorkWidth2);
	// <>================================================================================================
	
	if(screenWindow2Height <= 415){
		let newSizeWork = screenWorkWidth2 / 1.2;
		//console.log("Горизонтально: " + newSizeWork);
		addSize = Number(newSizeWork) * 5;
		var screen = document.querySelector('.works-screen__row');
		var screenWidthStr = window.getComputedStyle(screen, null).getPropertyValue('width');
		screen.style.width = addSize + 5 + 'px';
		for(let i = 0; i < screenWork.length; i++){
			screenWork[i].style.width = newSizeWork + 'px';
			screenWork[i].style.height = newSizeWork + 'px';
		}

	} else if (screenWindow2Width <= 415) {
		let newSizeWork = screenWorkWidth2 * 1.2;
		//console.log("Вертикально: " + newSizeWork);
		addSize = Number(newSizeWork) * 5;
		var screen = document.querySelector('.works-screen__row');
		var screenWidthStr = window.getComputedStyle(screen, null).getPropertyValue('width');
		screen.style.width = addSize + 5 + 'px';
		for(let i = 0; i < screenWork.length; i++){
			screenWork[i].style.width = newSizeWork + 'px';
			screenWork[i].style.height = newSizeWork + 'px';
		}
	} else{
		addSize = Number(screenWorkWidth) * 5;
		var screen = document.querySelector('.works-screen__row');
		var screenWidthStr = window.getComputedStyle(screen, null).getPropertyValue('width');
		screen.style.width = addSize + 5 + 'px';
	}
	// } else if (screenWindowWidth > screenWindow2Width){
	// 	let newSizeWork = screenWorkWidth2;
	// 	addSize = Number(newSizeWork) * 5;
	// 	for(let i = 0; i < screenWork.length; i++){
	// 		screenWork[i].style.width = newSizeWork + 'px';
	// 		screenWork[i].style.height = newSizeWork + 'px';
	// 	}
	// }else{
	// 	addSize = Number(screenWorkWidth) * 5;
	// }
	// console.log(screenWindowWidth + " " + screenWindow2Width);
	// screenWindowWidth = screenWindow2Width;

	// <>================================================================================================


	
	


	// var screenIcon = document.querySelectorAll('.icon');
	// var screenIconWidthStr = window.getComputedStyle(screenIcon[0], null).getPropertyValue('width');
	// let sizeIcon = screenIconWidthStr.length-2;
	// var screenIconWidth = screenIconWidthStr.substr(0, sizeIcon);

	// console.log(screenIconWidth);

	
	padding();
}, false);

// <ADAPTIVE GRID>================================================================================================





