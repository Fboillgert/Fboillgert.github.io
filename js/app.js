const defaultImg = 'https://logo-1256424525.cos.ap-hongkong.myqcloud.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.png';
const pictureCurtain = $('#picture-curtain');
const slickTrack = pictureCurtain.find('.slick-track');
var eleImgs = new Array();

function imgShow(eleIndex) {
	$('#img-header .index').text((eleIndex+1) + '/' + eleImgs.length);
	if (window.matchMedia("(max-aspect-ratio:7/10)").matches) {
		var maxWidth = 96;
		var maxHeight = 86.2;
		$('#img-back,#img-forward').hide();
		$('#img-header').show();
		$('#img-close').show();
	}else{
		var maxWidth = 83.33;
		var maxHeight = 88.88;
		$('.img-btn').show();
	}
	$('body').addClass('hide-scrollbar');
	$.each(eleImgs, function(index, img){
		if(eleIndex === index){
			var pre = index == 0? 0 : index-1;
			var next = index >= eleImgs.length-1?eleImgs.length-1 : index+1;
			$('#img-back').data('src', pre);
			$('#img-forward').data('src', next);
			slickTrack.data('index', eleIndex);
			return false;
		}
	})
	slickTrack.find('.landscape').css({'width': maxWidth + 'vw', 'height': maxHeight + 'vh'});
	pictureCurtain.show().fadeIn("fast");
	$(window).off('keydown');
	$(window).keydown(function(e){
		if(e.keyCode===37){
			$('#img-back').click();
		}else if(e.keyCode===39){
			$('#img-forward').click();
		}else if(e.keyCode===27){
			$('#img-close').click();
		}
	});
	slickTrack.css("transform","translate3d(-" + eleIndex + "00vw,0,0)");
}

function PicturePreview(){
	$('#content').on('click', '.card', function(){
		$('#img-header .name').text($(this).find('.card-header').text());
		eleImgs = supplies[$(this).data('id')]['imgs'];
		slickTrack.css('width', eleImgs.length + '00vw');
		$.each(eleImgs, function(index, img){
			slickTrack.append('<div class="slick-slide"><div class="landscape" data-slick-index="'+index+'" style="background: url('+img+') center center / contain no-repeat;"></div></div>');
		});
		imgShow(0);
	});
	$('#img-back').click(function(){
		imgShow($(this).data("src"));
	});
	$('#img-forward').click(function(){
		imgShow($(this).data("src"));
	});
	$("#img-close").click(function() {
		$('.img-btn').hide();
		pictureCurtain.fadeOut("fast");
		$('body').removeClass('hide-scrollbar');
		$(window).off('keydown');
		slickTrack.html('');
	});
	pictureCurtain.on('mousedown touchstart', function(e){
		var distenceX = e.pageX==undefined?e.originalEvent.targetTouches[0].pageX: e.pageX;
		var wWidth = $(window).width();
		var thisIndex = slickTrack.data('index');
		var x = 0;
		var xAbs = 0;
		var startTime = new Date();
		slickTrack.removeClass('slick-animation');
		pictureCurtain.on('mousemove touchmove', function(e){
			var pageX = e.pageX==undefined?e.originalEvent.targetTouches[0].pageX: e.pageX;
			x = pageX - distenceX;
			xAbs = Percentage(Math.abs(x), wWidth);
			if(x>0){
				var translate = parseInt(thisIndex + '00') - xAbs;
			}else if(x<0){
				var translate = parseInt(thisIndex + '00') + xAbs;
			}
			slickTrack.css("transform","translate3d(-" + parseInt(translate) + "vw,0,0)");
		});
		pictureCurtain.on('mouseup touchend', function(){
			pictureCurtain.off('mousemove touchmove mouseup touchend');
			slickTrack.addClass('slick-animation');
			if(xAbs==0 && (new Date() - startTime.getTime()) <= 100){
				$('#img-close').click();
			}else if(xAbs<=10){
				slickTrack.css("transform","translate3d(-" + thisIndex + "00vw,0,0)");
			}else if(x>0){
				$('#img-back').click();
			}else if(x<0){
				$('#img-forward').click();
			}
		});
	});
}

PicturePreview();

$.getJSON('supplies.json', function(supplies){
	$.each(supplies, function(index, value){
		var name = value['name'];
		var price = value['price'];
		var imgs = value['imgs'][0]===undefined?defaultImg: value['imgs'][0];
		$('#content').append('<div class="col-xl-2 col-lg-3 col-sm-6 col-6"><div class="card" data-id="'+index+'"><div class="card-header">'+name+'</div><img class="rounded" src="'+imgs+'" alt="'+name+'" /><div class="card-body"><h5 class="card-title"><span></span><span class="price">'+price+'</span></h5></div></div></div>')
	});
	
});