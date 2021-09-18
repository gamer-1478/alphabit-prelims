$('.counter').each(function () {
    var $this = $(this),
        countTo = $this.attr('data-count');

    $({ countNum: $this.text() }).animate({
        countNum: countTo
    },
        {
            duration: 2000,
            easing: 'linear',
            step: function () {
                $this.text(Math.floor(this.countNum));
            },
            complete: function () {
                $this.text(this.countNum);
                //alert('finished');
            }
        });

}); $('.counter').each(function () {
    var $this = $(this),
        countTo = $this.attr('data-count');

    $({ countNum: $this.text() }).animate({
        countNum: countTo
    },

        {

            duration: 2000,
            easing: 'linear',
            step: function () {
                $this.text(Math.floor(this.countNum));
            },
            complete: function () {
                $this.text(this.countNum);
                //alert('finished');
            }

        });



}); +
    $('.counter-1').each(function () {
        var $this = $(this),
            countTo = $this.attr('data-count');

        $({ countNum: $this.text() }).animate({
            countNum: countTo
        },

            {

                duration: 2000,
                easing: 'linear',
                step: function () {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function () {
                    $this.text(this.countNum);
                    //alert('finished');
                }

            });



    }); $('.counter-1').each(function () {
        var $this = $(this),
            countTo = $this.attr('data-count');

        $({ countNum: $this.text() }).animate({
            countNum: countTo
        },

            {

                duration: 2000,
                easing: 'linear',
                step: function () {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function () {
                    $this.text(this.countNum);
                    //alert('finished');
                }

            });



    });
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2,
    centeredSlides: true,
    pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
    },
});


// const imgList =  ['https://t3.ftcdn.net/jpg/01/97/11/64/360_F_197116416_hpfTtXSoJMvMqU99n6hGP4xX0ejYa4M7.jpg','https://t3.ftcdn.net/jpg/02/22/85/16/360_F_222851624_jfoMGbJxwRi5AWGdPgXKSABMnzCQo9RN.jpg','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UKKA1hd7Yr6H6DKQRksZTYJIXRfxAsYH9A&usqp=CAU','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvl-eupMkPlVfcJl7KVECsZYb505sS5ZZDsw&usqp=CAU','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMpqAEMcCPN_1W3K3pupqCEKXeLUwFI3QyiQ&usqp=CAU','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Joj2JFcxkzPz4S7ZEyg9DXilXkw6R0wTakbI4M4BCIt3uH_eHKfYFsW8RcFQBFJBj2g&usqp=CAU'];

// for (var i = 0; i<imgList.length;i++){
//     const div = document.createElement('div');
//     div.style.background = `url(${imgList[i]})`;
//     div.classList.add(`user-${i+1}`);
//     document.querySelector('.user-div').appendChild(div);
// }
const navMob = document.createElement('div');
navMob.innerHTML = `
    <br>
    <br>
    <br>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Clients</a>
    <a href="#">Contact</a>
`;
navMob.classList.add('overlay');
navMob.setAttribute('id', 'myNav')
document.querySelector('body').append(navMob);
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}