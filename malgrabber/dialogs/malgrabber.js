CKEDITOR.dialog.add( 'malGrabberDialog' , function( editor ) {
    return {
        minWidth: 350,
        minHeight: 100,
        title: editor.lang.malgrabber.title,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents: [
            {
                id: 'info',
                elements: [
                {
                    type: 'hbox',
                    widths: [ '35%', '65%' ],
                    children: [
                    {
                        id: 'type',
                        type: 'select',
                        inputStyle: 'width: 95px',
                        label: editor.lang.malgrabber.infoType,
                        labelStyle: 'font-weight: bold',
                        'default': 'anime',
                        items: [
                            ['anime'],
                            ['manga'],
                        ],
                    },
                    {
                        id: 'id',
                        type: 'text',
                        inputStyle: 'width: 65px; margin-bottom: 10px',
                        label: editor.lang.malgrabber.infoId,
                        labelStyle: 'font-weight: bold',
                        validate: CKEDITOR.dialog.validate.notEmpty( editor.lang.malgrabber.infoIdValidate ),
                    },
                ]
                },
                    {
                        id: 'custom_title',
                        type: 'text',
                        inputStyle: 'margin-bottom: 10px',
                        label: editor.lang.malgrabber.infoCustomAnimeTitle,
                    },
                    {
                        id: 'subject',
                        type: 'textarea',
                        rows: '10',
                        label: editor.lang.malgrabber.infoSubject,
                    },
                ]
            }
        ],
        onOk: function() {
        var
        dialog            = this,
        info_type         = dialog.getValueOf( 'info', 'type' ),
        info_id           = parseInt(dialog.getValueOf( 'info', 'id' )),
        info_custom_title = dialog.getValueOf( 'info', 'custom_title' ),
        info_subject      = escapeHTML(dialog.getValueOf( 'info', 'subject' ));

            if( Number.isInteger(info_id) ) {
            var
            base_path = CKEDITOR_BASEPATH + '/plugins/malgrabber/',
            url     = 'https://myanimelist.net/' + info_type + '/' + info_id,
            loading = editor.document.createElement( 'div' );

            loading.setAttribute( "id", "loadingMAL" );
            loading.setHtml( '<img src=' + base_path + 'icons/ajax-loader.gif>' );
            editor.insertElement( loading );

                jQuery.ajax( {
                url: base_path + "getdata.php",
                data: "url=" + url + '&custom_title=' + info_custom_title,
                type: "POST",
                    success:function( data ){
                    editor.document.getById( 'loadingMAL' ).remove();

                        if      ( data.match( "limit is over" ) )                { editor.showNotification( editor.lang.malgrabber.limitError        ); }
                        else if ( data.match( "file_get_contents" ) )            { editor.showNotification( editor.lang.malgrabber.urlError          ); }
                        else if ( data.match( "poster size is too big" ) )       { editor.showNotification( editor.lang.malgrabber.posterSizeError   ); }
                        else if ( data.match( "poster folder is not created" ) ) { editor.showNotification( editor.lang.malgrabber.posterFolderError ); }
                        else if ( data.match( "missing data" ) )                 { editor.showNotification( editor.lang.malgrabber.missingData       ); }
                        else{
                        var anime   = JSON.parse(data),
                        mal_div     = editor.document.createElement( 'div' );

                        mal_div.setAttribute( 'class', 'getDataMAL' );

                        var anime_date = editor.lang.malgrabber.malAnimeDate;
                        if ( info_type == "manga" ) { anime_date = editor.lang.malgrabber.malMangaDate; }

                        if ( editor.lang.malgrabber.langSwitch != "en") {

                        anime.mal_info.info.mal_type = swap_text( "tv",        editor.lang.malgrabber.malTypeValueTv,       anime.mal_info.info.mal_type );
                        anime.mal_info.info.mal_type = swap_text( "movie",     editor.lang.malgrabber.malTypeValueMovie,    anime.mal_info.info.mal_type );
                        anime.mal_info.info.mal_type = swap_text( "special",   editor.lang.malgrabber.malTypeValueSpecial,  anime.mal_info.info.mal_type );
                        anime.mal_info.info.mal_type = swap_text( "music",     editor.lang.malgrabber.malTypeValueMusic,    anime.mal_info.info.mal_type );
                        anime.mal_info.info.mal_type = swap_text( "novel",     editor.lang.malgrabber.malGeneralValueNovel, anime.mal_info.info.mal_type );
                        anime.mal_info.info.mal_type = swap_text( "one\-shot", editor.lang.malgrabber.malTypeValueOneShot,  anime.mal_info.info.mal_type );

                        anime.mal_info.info.mal_episode       = swap_text( "unknown", editor.lang.malgrabber.malGeneralValueUnknown,anime.mal_info.info.mal_episode );
                        anime.mal_info.info.mal_manga_chapter = swap_text( "unknown", editor.lang.malgrabber.malGeneralValueUnknown,anime.mal_info.info.mal_manga_chapter );
                        anime.mal_info.info.mal_manga_volume  = swap_text( "unknown", editor.lang.malgrabber.malGeneralValueUnknown,anime.mal_info.info.mal_manga_volume );

                        anime.mal_info.info.mal_date = swap_text( "jan +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueJan,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "feb +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueFeb,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "mar +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueMar,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "apr +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueApr,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "may +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueMay,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "jun +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueJun,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "jul +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueJul,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "aug +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueAug,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "sep +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueSep,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "oct +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueOct,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "nov +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueNov,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "dec +([0-9]+), +([0-9+])", editor.lang.malgrabber.malDateValueDec,          anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "( to )",                   editor.lang.malgrabber.malDateValueTo,           anime.mal_info.info.mal_date );
                        anime.mal_info.info.mal_date = swap_text( "Not available",            editor.lang.malgrabber.malDateValueNotAvailable, anime.mal_info.info.mal_date );

                        anime.mal_info.info.mal_duration = swap_text( "([0-9]+) hr\. ([0-9]+) min\.", editor.lang.malgrabber.malDurationValueHours, anime.mal_info.info.mal_duration );
                        anime.mal_info.info.mal_duration = swap_text( "([0-9]+) min. per ep.",      editor.lang.malgrabber.malDurationValueMins,  anime.mal_info.info.mal_duration );
                        anime.mal_info.info.mal_duration = swap_text( "([0-9]+) min\.",               editor.lang.malgrabber.malDurationValueMins,  anime.mal_info.info.mal_duration );

                        anime.mal_info.info.mal_genres = swap_text( "action",        editor.lang.malgrabber.malGenresValueAction,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "adventure",     editor.lang.malgrabber.malGenresValueAdventure,     anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "cars",          editor.lang.malgrabber.malGenresValueCars,          anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "comedy",        editor.lang.malgrabber.malGenresValueComedy,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "dementia",      editor.lang.malgrabber.malGenresValueDementia,      anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "demons",        editor.lang.malgrabber.malGenresValueDemons,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "drama",         editor.lang.malgrabber.malGenresValueDrama,         anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "doujinshi",     editor.lang.malgrabber.malGenresValueDoujinshi,     anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "ecchi",         editor.lang.malgrabber.malGenresValueEcchi,         anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "fantasy",       editor.lang.malgrabber.malGenresValueFantasy,       anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "game",          editor.lang.malgrabber.malGenresValueGame,          anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "gender bender", editor.lang.malgrabber.malGenresValueGenderBender,  anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "harem",         editor.lang.malgrabber.malGenresValueHarem,         anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "hentai",        editor.lang.malgrabber.malGenresValueHentai,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "historical",    editor.lang.malgrabber.malGenresValueHistorical,    anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "horror",        editor.lang.malgrabber.malGenresValueHorror,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "josei",         editor.lang.malgrabber.malGenresValueJosei,         anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "kids",          editor.lang.malgrabber.malGenresValueKids,          anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "magic",         editor.lang.malgrabber.malGenresValueMagic,         anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "martial arts",  editor.lang.malgrabber.malGenresValueMartialArts,   anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "mecha",         editor.lang.malgrabber.malGenresValueMecha,         anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "military",      editor.lang.malgrabber.malGenresValueMilitary,      anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "music",         editor.lang.malgrabber.malGenresValueMusic,         anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "mystery",       editor.lang.malgrabber.malGenresValueMystery,       anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "parody",        editor.lang.malgrabber.malGenresValueParody,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "police",        editor.lang.malgrabber.malGenresValuePolice,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "psychological", editor.lang.malgrabber.malGenresValuePsychological, anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "romance",       editor.lang.malgrabber.malGenresValueRomance,       anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "samurai",       editor.lang.malgrabber.malGenresValueSamurai,       anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "school",        editor.lang.malgrabber.malGenresValueSchool,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "sci\-fi",       editor.lang.malgrabber.malGenresValueScFi,          anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "seinen",        editor.lang.malgrabber.malGenresValueSeinen,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "shoujo",        editor.lang.malgrabber.malGenresValueShoujo,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "shoujo ai",     editor.lang.malgrabber.malGenresValueShoujoAi,      anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "shounen",       editor.lang.malgrabber.malGenresValueShounen,       anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "shounen ai",    editor.lang.malgrabber.malGenresValueShounenAi,     anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "slice of life", editor.lang.malgrabber.malGenresValueSliceofLife,   anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "space",         editor.lang.malgrabber.malGenresValueSpace,         anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "sports",        editor.lang.malgrabber.malGenresValueSports,        anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "super power",   editor.lang.malgrabber.malGenresValueSuperPower,    anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "supernatural",  editor.lang.malgrabber.malGenresValueSuperNatural,  anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "thriller",      editor.lang.malgrabber.malGenresValueThriller,      anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "vampire",       editor.lang.malgrabber.malGenresValueVampire,       anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "yaoi",          editor.lang.malgrabber.malGenresValueYaoi,          anime.mal_info.info.mal_genres );
                        anime.mal_info.info.mal_genres = swap_text( "yuri",          editor.lang.malgrabber.malGenresValueYuri,          anime.mal_info.info.mal_genres );

                        anime.mal_info.info.mal_anime_source = swap_text( "original",     editor.lang.malgrabber.malSourceValueOriginal,     anime.mal_info.info.mal_anime_source );
                        anime.mal_info.info.mal_anime_source = swap_text( "visual novel", editor.lang.malgrabber.malGeneralValueVisualNovel, anime.mal_info.info.mal_anime_source );
                        anime.mal_info.info.mal_anime_source = swap_text( "light novel",  editor.lang.malgrabber.malGeneralValueLightNovel,  anime.mal_info.info.mal_anime_source );
                        anime.mal_info.info.mal_anime_source = swap_text( "novel",        editor.lang.malgrabber.malGeneralValueNovel,       anime.mal_info.info.mal_anime_source );

                        anime.mal_info.statistics.mal_score = swap_text( "N/A", editor.lang.malgrabber.malGeneralValueNA, anime.mal_info.statistics.mal_score );
                        anime.mal_info.statistics.mal_rank  = swap_text( "N/A", editor.lang.malgrabber.malGeneralValueNA, anime.mal_info.statistics.mal_rank  );

                        anime.mal_info.info.mal_manga_authors = swap_text( "\(story \& art\)", editor.lang.malgrabber.malMangaAuthorsValueStoryandArt, anime.mal_info.info.mal_manga_authors );
                        anime.mal_info.info.mal_manga_authors = swap_text( "\(story\)",        editor.lang.malgrabber.malMangaAuthorsValueStory,       anime.mal_info.info.mal_manga_authors );
                        anime.mal_info.info.mal_manga_authors = swap_text( "\(art\)",          editor.lang.malgrabber.malMangaAuthorsValueArt,         anime.mal_info.info.mal_manga_authors );

						anime.mal_info.info.mal_manga_publisher = swap_text( "none",          editor.lang.malgrabber.malMangaPublisherValueNone,      anime.mal_info.info.mal_manga_publisher );
						anime.mal_info.info.mal_manga_publisher = swap_text( '\(monthly\)',   editor.lang.malgrabber.malMangaPublisherValueMonthly,   anime.mal_info.info.mal_manga_publisher );
						anime.mal_info.info.mal_manga_publisher = swap_text( '\(weekly\)',    editor.lang.malgrabber.malMangaPublisherValueWeekly,    anime.mal_info.info.mal_manga_publisher );
						anime.mal_info.info.mal_manga_publisher = swap_text( '\(quarterly\)', editor.lang.malgrabber.malMangaPublisherValueQuarterly, anime.mal_info.info.mal_manga_publisher );

                        if ( info_subject ) { anime.mal_subject.mal_subject = info_subject; }

                        anime.mal_info.info.mal_manga_authors = reverse_name(anime.mal_info.info.mal_manga_authors);

                        }


                        var mal_html =
                        '<div class="mal_title"><b>' + anime.mal_title + '</b></div>'
                        +
                        '<div class="mal_content">'
                        +
                        '<div class="mal_subject">'
                        +
                        '<div class="mal_poster"><img src="' + anime.mal_poster + '"></div>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderOtherNames + '</b></p>'
                        +
                        '<div class="mal_text">'
                        +
                        namer([
                        anime.mal_subject.mal_title_alt,
                        anime.mal_subject.mal_title_english,
                        anime.mal_subject.mal_title_japanese,
                        anime.mal_subject.mal_title_synonyms,
                        ],[
                        editor.lang.malgrabber.malTitleAlt,
                        editor.lang.malgrabber.malTitleEnglish,
                        editor.lang.malgrabber.malTitleJapanese,
                        editor.lang.malgrabber.malTitleSynonyms,
                        ])
                        +
                        '</div>'
                        +
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderSubject + '</b></p>'
                        +
                        '<div class="mal_text">'
                        +
                        anime.mal_subject.mal_subject
                        +
                        '</div>'
                        +
                        '</div>'
                        +
                        '<div class="mal_info">'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderInfo + '</b></p>'
                        +
                        '<div class="mal_text">'
                        +
                        namer([
                        anime.mal_info.info.mal_type,
                        anime.mal_info.info.mal_episode,
                        anime.mal_info.info.mal_manga_volume,
                        anime.mal_info.info.mal_manga_chapter,
                        anime.mal_info.info.mal_date,
                        anime.mal_info.info.mal_anime_publisher,
                        anime.mal_info.info.mal_manga_publisher,
                        anime.mal_info.info.mal_anime_source,
                        anime.mal_info.info.mal_manga_authors,
                        anime.mal_info.info.mal_genres,
                        anime.mal_info.info.mal_duration,
                        ],[
                        editor.lang.malgrabber.malType,
                        editor.lang.malgrabber.malEpisode,
                        editor.lang.malgrabber.malMangaVolume,
                        editor.lang.malgrabber.malMangaChapter,
                        anime_date,
                        editor.lang.malgrabber.malAnimePublisher,
                        editor.lang.malgrabber.malMangaPublisher,
                        editor.lang.malgrabber.malAnimeSource,
                        editor.lang.malgrabber.malMangaAuthors,
                        editor.lang.malgrabber.malGenres,
                        editor.lang.malgrabber.malDuration,
                        ])
                        +
                        '</div>'
                        +
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderStatistics + '</b></p>'
                        +
                        '<div class="mal_text">'
                        +
                        namer([
                        anime.mal_info.statistics.mal_score,
                        anime.mal_info.statistics.mal_rank,
                        ],[
                        editor.lang.malgrabber.malScore,
                        editor.lang.malgrabber.malRank,
                        ])
                        +
                        '</div>'
                        +
                        '</div>'
                        +
                        '</div>'
                        +
                        '<div class="mal_source"><a href="' + url + '" target="_blank">' + info_type + ' / ' + info_id + '</a></div>';

                        mal_div.setHtml( mal_html );

                        editor.insertElement( mal_div );
                        }
                    }
                });
            }
            else {
            editor.showNotification( editor.lang.malgrabber.idError );
            }
        }
    };
} );

function namer( t, h ) {
    var
    r = [],
    n = 0;

    for (i = 0; i < t.length; i++) {
        if ( t[i] ) {        
        r[n] = '<b>' + h[i] + '</b>' + t[i];
        n = n + 1;
        }
    }

    return r.join("<br>");
}

function swap_text( find, replace, str ) {
    var
    re = new RegExp( find, "gi" ),
    mes = str.match( /\$[0-9]+/g ),
    r = "";

    if ( mes ) { r = str.replace(re,replace); }
    else {
    if (str.match(re)) { r = str.replace(re,replace); }
    else r = str;
    }

    return r;
}

function escapeHTML(str) {
    str = str.replace('<','&amp;lt;');
    str = str.replace('>','&amp;gt;');
    str = str.replace(/\n/g,'<br>');
    return str;
}

function reverse_name(str,split_char) {
var s = str;
var r = "";
if (s.match(",")) {
split_str = s.split("), ");
   	for (i = 0; i < split_str.length; i++){
		if (split_str[i].match(",")){
		r = r + split_str[i].replace(/(.*), (.*) (\(.*)/,'$2 $1 $3');
        }
        else {
		r = r + split_str[i] + '';
        }
     if (split_str.length != i - 1) {r = r + '), '}
    }
    r = r.replace(')),',')');
}
return r;
}