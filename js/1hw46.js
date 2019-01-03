$(function () {
    var urlArray = [];
    var namesArray = [];
    var k = 1;

    var request = function (url) {
        return $.get(url, function (result) {
        });
    };

    var createList = function (result) {
        var response = result.results;
        var j = 1;
        for (var i = 0; i < response.length; i++) {
            if (i % 20 === 0) {
                var ul = $('<ul class="ul_name names_' + j + '"></ul>');
                $('.block_1').append(ul);
                j++;
            }
            var name = response[i].name;
            namesArray.push(name);
            urlArray.push(response[i].url);
            var list = $('<li id=' + i + '>' + name + '</li>');
            ul.append(list);
        }
    }

    var showInfoCallback = function (item) {
        return function () {
            $('#name').text(item.name);
            $('#type').text(item.type);
            $('#height').text(item.height);
            $('#weight').text(item.weight);
            $('.image_1').attr('src', item.image_1);
            $('.image_2').attr('src', item.image_2);
            $('.image_3').attr('src', item.image_3);
            $('.image_4').attr('src', item.image_4);
        }
    };

    var run = async function () {
        try {
            var result = await
            request('https://pokeapi.co/api/v2/pokemon/');
            var names = createList(result);
            var info = await Promise.all(urlArray.map(function (url) {
                return request(url);
            }));
            var infoText = [];
            for (var i = 0; i < info.length; i++) {
                var element = info[i];
                var item = {
                    id: i,
                    type: element.types[0].type.name,
                    height: element.height,
                    weight: element.weight,
                    image_1: element.sprites.front_default,
                    image_2: element.sprites.back_default,
                    image_3: element.sprites.front_shiny,
                    image_4: element.sprites.back_shiny,
                    name: element.species.name
                }
                infoText.push(item);
                item = infoText[i]
                $('#' + item.id).on('click', showInfoCallback(item));
            }
        } catch (e) {
            console.error(e);
        }
    }

    run();

    $('.next').on('click', function () {
        $('.names_' + k).hide();
        $('.names_' + (k + 1)).show();
        k++;
    });
    $('.prev').on('click', function () {
        $('.names_' + k).hide();
        $('.names_' + (k - 1)).show();
        k--;
    });
    var preloader = $('#preloader');

    $(document).ajaxStart(function () {
        preloader.show();
    });
    $(document).ajaxStop(function () {
        preloader.hide();
    });
});