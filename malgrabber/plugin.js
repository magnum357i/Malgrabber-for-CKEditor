/*
 *   @name                 Malgrabber
 *   @description          This is a plugin to get anime or manga information from MyAnimeList.
 *   @version              1.4.4
 *   @license              MIT-style license
 *   @author               Magnum357
 *   @download             https://github.com/magnum357i/Malgrabber-for-CKEditor
 */

CKEDITOR.plugins.add( 'malgrabber', {
	requires: 'widget',
    icons:    'malgrabber',
    lang:     'tr,en',
    init:  function( editor ) {

    $(function() {

        var
        malMore_maxHeight   = 250,
        malMore_messageShow = editor.lang.malgrabber.malMore;

        $( '.mal_subject .mal_text' ).each( function() {
            if ( $( this ).height() > malMore_maxHeight ) {
            $( this ).addClass( "mal_more" );
            $( this ).parent().html( $( this ).parent().html() + '<div class="mal_more_click">' + malMore_messageShow + '</div>' );
            }
        });


        $(".mal_more_click").click(function() {

            $( this ).parent().find(".mal_text").removeClass("mal_more");
            $( this ).hide();

        });
    });



        var html_head = document.getElementsByTagName( 'head' )[0],
        html_style    = html_head.getElementsByTagName( 'style' )[0],
        css_file      = this.path + "malgrabber.css";

            if ( html_style )
            {
                $.ajax({
                url:     css_file,
                success: function( data ) { $( html_style ).append( data ); }
                })
            }
            else
            {
                $.ajax({
                url:     css_file,
                success: function( data ) { $( "<style></style>" ).appendTo( "head" ).html( data ); }
                })
            }

        CKEDITOR.dialog.add( 'malgrabber', this.path + 'dialogs/malgrabber.js' );



		editor.widgets.add( 'malgrabber', {
			allowedContent:
				'span;span(mal_subject_source_title);p(mal_header);div(getDataMAL);div(mal_title);div(mal_title_text);div(mal_logo);div(mal_subject);div(mal_content);div(mal_info);div(mal_source);div(mal_subject_and_crew);div(mal_crew);div(mal_text);div(mal_subject_source);',

			requiredContent: 'div(getDataMAL)',

			editables: {
				subject: {
					selector: '.mal_subject .mal_text',
					allowedContent: 'p;p(mal_header);br;b;strong;em;i;a[href];div;div(mal_text);div(mal_subject_source);span(mal_subject_source_title);span',
				},
                subject_source: {
                    selector: '.mal_subject_source .mal_text',
                    allowedContent: 'a[href]',
                }
			},



			template:
			'<div class="getDataMAL loaderMAL">'
			+
			'<div class="mal_title"><div class="mal_title_text"></div><div class="mal_logo"></div></div>'
			+
			'<div class="mal_content">'
			+
			'<div class="mal_subject_and_crew"><div class="mal_subject"><p class="mal_header"></p><div class="mal_text"></div><div class="mal_subject_source"><span class="mal_subject_source_title"></span><div class="mal_text"></div></div></div><div class="mal_crew"></div></div><div class="mal_info"></div>'
			+
			'</div>'
			+
			'<div class="mal_source"></div>'
			+
			'</div>',

			button: editor.lang.malgrabber.button,
			dialog: 'malgrabber',

			upcast: function( element ) {
				return element.name == 'div' && element.hasClass( 'getDataMAL' );
			},

			data: function() {

				if ( this.data.type && this.data.id ) {

				var
        		info_type                  = this.data.type,
        		info_id                    = parseInt( this.data.id ),
        		custom_title               = this.data.title,
        		custom_subject             = this.data.subject,
        		custom_subject_source      = this.data.subject_source,
        		custom_subject_source_link = this.data.subject_source_link,
            	base_path                  = CKEDITOR_BASEPATH + '/plugins/malgrabber/',
            	url                        = 'https://myanimelist.net/' + info_type + '/' + info_id,
        		mal_html                   = this.element.getHtml();

				if ( Number.isInteger( info_id ) ) {

				var
				malSelect_main                 = this.element.findOne( '.getDataMAL' ),
				malSelect_title_text           = this.element.findOne( '.mal_title_text' ),
				malSelect_logo                 = this.element.findOne( '.mal_logo' ),
				malSelect_subject_title        = this.element.findOne( '.mal_subject .mal_header' ),
				malSelect_subject              = this.element.findOne( '.mal_subject .mal_text' ),
                malSelect_subject_source       = this.element.findOne( '.mal_subject_source' ),
                malSelect_subject_source_text  = this.element.findOne( '.mal_subject_source .mal_text' ),
                malSelect_subject_source_title = this.element.findOne( '.mal_subject_source .mal_subject_source_title' ),
				malSelect_crew                 = this.element.findOne( '.mal_crew' ),
				malSelect_info                 = this.element.findOne( '.mal_info' ),
				malSelect_source               = this.element.findOne( '.mal_source' );

				malSelect_title_text.setHtml( '<img src="' + base_path + '/icons/ajax-loader.gif">' );

                	$.ajax( {
                	url: base_path + 'json.php',
                	data: 'url=' + url + '&custom_title=' + custom_title + '&default_timezone=' + editor.lang.malgrabber.langTimeZone,
                	type: 'POST',
						success: function( data ){

						if ( data.match( /mal_cookie_limit=[0-9]*?,[0-9]*?,[0-9]*?/ ) ) {
                        data = data.replace( /[^0-9,]+/, '' );

                        var
                        l_lhm      = data.split( ',' ),
                        limitError = editor.lang.malgrabber.limitError;

                        for ( i = 0; i < l_lhm.length; i++ ) { limitError = limitError.replace( '$' + (i + 1), l_lhm[i] ); }

                        editor.showNotification( limitError );
                    	$( '.loaderMAL' ).remove();

                        }
                        else if ( data.match( "poster size is too big" ) )       { editor.showNotification( editor.lang.malgrabber.posterSizeError   ); $(".loaderMAL").remove(); }
                        else if ( data.match( "poster folder is not created" ) ) { editor.showNotification( editor.lang.malgrabber.posterFolderError ); $(".loaderMAL").remove(); }
                        else if ( data.match( "missing data" ) )                 { editor.showNotification( editor.lang.malgrabber.missingData       ); $(".loaderMAL").remove(); }
                        else{

                        var anime = JSON.parse( data );

                        var anime_date = editor.lang.malgrabber.malAnimeDate;
                        if ( info_type == "manga" ) { anime_date = editor.lang.malgrabber.malMangaDate; }

                        if ( editor.lang.malgrabber.langSwitch != "en") {

                        anime.mal_info.info.mal_type            = swap_text( "tv",                       editor.lang.malgrabber.malTypeValueTv,                  anime.mal_info.info.mal_type            );
                        anime.mal_info.info.mal_type            = swap_text( "movie",                    editor.lang.malgrabber.malTypeValueMovie,               anime.mal_info.info.mal_type            );
                        anime.mal_info.info.mal_type            = swap_text( "special",                  editor.lang.malgrabber.malTypeValueSpecial,             anime.mal_info.info.mal_type            );
                        anime.mal_info.info.mal_type            = swap_text( "music",                    editor.lang.malgrabber.malTypeValueMusic,               anime.mal_info.info.mal_type            );
                        anime.mal_info.info.mal_type            = swap_text( "novel",                    editor.lang.malgrabber.malTypeValueNovel,               anime.mal_info.info.mal_type            );
                        anime.mal_info.info.mal_type            = swap_text( "one\-shot",                editor.lang.malgrabber.malTypeValueOneShot,             anime.mal_info.info.mal_type            );


                        anime.mal_info.info.mal_date            = swap_text( "jan +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueJan,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "feb +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueFeb,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "mar +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueMar,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "apr +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueApr,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "may +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueMay,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "jun +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueJun,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "jul +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueJul,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "aug +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueAug,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "sep +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueSep,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "oct +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueOct,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "nov +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueNov,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "dec +([0-9]*), +([0-9+])", editor.lang.malgrabber.malDateValueDec,                 anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "jan,? +([0-9]*)",          editor.lang.malgrabber.malDateValueJan2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "feb,? +([0-9]*)",          editor.lang.malgrabber.malDateValueFeb2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "mar,? +([0-9]*)",          editor.lang.malgrabber.malDateValueMar2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "apr,? +([0-9]*)",          editor.lang.malgrabber.malDateValueApr2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "may,? +([0-9]*)",          editor.lang.malgrabber.malDateValueMay2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "jun,? +([0-9]*)",          editor.lang.malgrabber.malDateValueJun2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "jul,? +([0-9]*)",          editor.lang.malgrabber.malDateValueJul2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "aug,? +([0-9]*)",          editor.lang.malgrabber.malDateValueAug2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "sep,? +([0-9]*)",          editor.lang.malgrabber.malDateValueSep2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "oct,? +([0-9]*)",          editor.lang.malgrabber.malDateValueOct2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "nov,? +([0-9]*)",          editor.lang.malgrabber.malDateValueNov2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "dec,? +([0-9]*)",          editor.lang.malgrabber.malDateValueDec2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "( to )",                   editor.lang.malgrabber.malDateValueTo,                  anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "Not available",            editor.lang.malgrabber.malDateValueNotAvailable,        anime.mal_info.info.mal_date            );


                        anime.mal_info.info.mal_duration        = swap_text( " per ep\.",                '',                                                     anime.mal_info.info.mal_duration        );
                        anime.mal_info.info.mal_duration        = swap_text( "hr\.",                     editor.lang.malgrabber.malDurationValueHours,           anime.mal_info.info.mal_duration        );
                        anime.mal_info.info.mal_duration        = swap_text( "min\.",                    editor.lang.malgrabber.malDurationValueMins,            anime.mal_info.info.mal_duration        );


                        anime.mal_info.info.mal_genres          = swap_text( "action",                   editor.lang.malgrabber.malGenresValueAction,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "adventure",                editor.lang.malgrabber.malGenresValueAdventure,         anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "cars",                     editor.lang.malgrabber.malGenresValueCars,              anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "comedy",                   editor.lang.malgrabber.malGenresValueComedy,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "dementia",                 editor.lang.malgrabber.malGenresValueDementia,          anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "demons",                   editor.lang.malgrabber.malGenresValueDemons,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "drama",                    editor.lang.malgrabber.malGenresValueDrama,             anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "doujinshi",                editor.lang.malgrabber.malGenresValueDoujinshi,         anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "ecchi",                    editor.lang.malgrabber.malGenresValueEcchi,             anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "fantasy",                  editor.lang.malgrabber.malGenresValueFantasy,           anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "game",                     editor.lang.malgrabber.malGenresValueGame,              anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "gender bender",            editor.lang.malgrabber.malGenresValueGenderBender,      anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "harem",                    editor.lang.malgrabber.malGenresValueHarem,             anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "hentai",                   editor.lang.malgrabber.malGenresValueHentai,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "historical",               editor.lang.malgrabber.malGenresValueHistorical,        anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "horror",                   editor.lang.malgrabber.malGenresValueHorror,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "josei",                    editor.lang.malgrabber.malGenresValueJosei,             anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "kids",                     editor.lang.malgrabber.malGenresValueKids,              anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "magic",                    editor.lang.malgrabber.malGenresValueMagic,             anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "martial arts",             editor.lang.malgrabber.malGenresValueMartialArts,       anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "mecha",                    editor.lang.malgrabber.malGenresValueMecha,             anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "military",                 editor.lang.malgrabber.malGenresValueMilitary,          anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "music",                    editor.lang.malgrabber.malGenresValueMusic,             anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "mystery",                  editor.lang.malgrabber.malGenresValueMystery,           anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "parody",                   editor.lang.malgrabber.malGenresValueParody,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "police",                   editor.lang.malgrabber.malGenresValuePolice,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "psychological",            editor.lang.malgrabber.malGenresValuePsychological,     anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "romance",                  editor.lang.malgrabber.malGenresValueRomance,           anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "samurai",                  editor.lang.malgrabber.malGenresValueSamurai,           anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "school",                   editor.lang.malgrabber.malGenresValueSchool,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "sci\-fi",                  editor.lang.malgrabber.malGenresValueScFi,              anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "seinen",                   editor.lang.malgrabber.malGenresValueSeinen,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "shoujo",                   editor.lang.malgrabber.malGenresValueShoujo,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "shoujo ai",                editor.lang.malgrabber.malGenresValueShoujoAi,          anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "shounen",                  editor.lang.malgrabber.malGenresValueShounen,           anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "shounen ai",               editor.lang.malgrabber.malGenresValueShounenAi,         anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "slice of life",            editor.lang.malgrabber.malGenresValueSliceofLife,       anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "space",                    editor.lang.malgrabber.malGenresValueSpace,             anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "sports",                   editor.lang.malgrabber.malGenresValueSports,            anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "super power",              editor.lang.malgrabber.malGenresValueSuperPower,        anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "supernatural",             editor.lang.malgrabber.malGenresValueSuperNatural,      anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "thriller",                 editor.lang.malgrabber.malGenresValueThriller,          anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "vampire",                  editor.lang.malgrabber.malGenresValueVampire,           anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "yaoi",                     editor.lang.malgrabber.malGenresValueYaoi,              anime.mal_info.info.mal_genres          );
                        anime.mal_info.info.mal_genres          = swap_text( "yuri",                     editor.lang.malgrabber.malGenresValueYuri,              anime.mal_info.info.mal_genres          );


                        anime.mal_info.info.mal_anime_source    = swap_text( "original",                 editor.lang.malgrabber.malSourceValueOriginal,          anime.mal_info.info.mal_anime_source    );
                        anime.mal_info.info.mal_anime_source    = swap_text( "visual novel",             editor.lang.malgrabber.malSourceValueVisualNovel,       anime.mal_info.info.mal_anime_source    );
                        anime.mal_info.info.mal_anime_source    = swap_text( "light novel",              editor.lang.malgrabber.malSourceValueLightNovel,        anime.mal_info.info.mal_anime_source    );
                        anime.mal_info.info.mal_anime_source    = swap_text( "novel",                    editor.lang.malgrabber.malSourceValueNovel,             anime.mal_info.info.mal_anime_source    );
                        anime.mal_info.info.mal_anime_source    = swap_text( "music",                    editor.lang.malgrabber.malSourceValueMusic,             anime.mal_info.info.mal_anime_source    );
                        anime.mal_info.info.mal_anime_source    = swap_text( "other",                    editor.lang.malgrabber.malSourceValueOther,             anime.mal_info.info.mal_anime_source    );
                        anime.mal_info.info.mal_anime_source    = swap_text( "game",                     editor.lang.malgrabber.malSourceValueGame,              anime.mal_info.info.mal_anime_source    );


                        anime.mal_info.info.mal_manga_authors   = swap_text( "\(story \& art\)",         editor.lang.malgrabber.malMangaAuthorsValueStoryandArt, anime.mal_info.info.mal_manga_authors   );
                        anime.mal_info.info.mal_manga_authors   = swap_text( "\(story\)",                editor.lang.malgrabber.malMangaAuthorsValueStory,       anime.mal_info.info.mal_manga_authors   );
                        anime.mal_info.info.mal_manga_authors   = swap_text( "\(art\)",                  editor.lang.malgrabber.malMangaAuthorsValueArt,         anime.mal_info.info.mal_manga_authors   );


                        anime.mal_info.info.mal_manga_publisher = swap_text( "none",                     editor.lang.malgrabber.malMangaPublisherValueNone,      anime.mal_info.info.mal_manga_publisher );
                        anime.mal_info.info.mal_manga_publisher = swap_text( '\(monthly\)',              editor.lang.malgrabber.malMangaPublisherValueMonthly,   anime.mal_info.info.mal_manga_publisher );
                        anime.mal_info.info.mal_manga_publisher = swap_text( '\(weekly\)',               editor.lang.malgrabber.malMangaPublisherValueWeekly,    anime.mal_info.info.mal_manga_publisher );
                        anime.mal_info.info.mal_manga_publisher = swap_text( '\(quarterly\)',            editor.lang.malgrabber.malMangaPublisherValueQuarterly, anime.mal_info.info.mal_manga_publisher );


                        anime.mal_info.statistics.mal_score     = swap_text( "N/A",                      editor.lang.malgrabber.malGeneralValueNA,               anime.mal_info.statistics.mal_score     );
                        anime.mal_info.statistics.mal_rank      = swap_text( "N/A",                      editor.lang.malgrabber.malGeneralValueNA,               anime.mal_info.statistics.mal_rank      );


                        anime.mal_info.info.mal_episode         = swap_text( "unknown",                  editor.lang.malgrabber.malGeneralValueUnknown,          anime.mal_info.info.mal_episode         );
                        anime.mal_info.info.mal_manga_chapter   = swap_text( "unknown",                  editor.lang.malgrabber.malGeneralValueUnknown,          anime.mal_info.info.mal_manga_chapter   );
                        anime.mal_info.info.mal_manga_volume    = swap_text( "unknown",                  editor.lang.malgrabber.malGeneralValueUnknown,          anime.mal_info.info.mal_manga_volume    );
                        anime.mal_info.info.mal_anime_source    = swap_text( "unknown",                  editor.lang.malgrabber.malGeneralValueUnknown,          anime.mal_info.info.mal_anime_source    );
                        anime.mal_info.info.mal_duration        = swap_text( "unknown",                  editor.lang.malgrabber.malGeneralValueUnknown,          anime.mal_info.info.mal_duration        );


                        anime.mal_info.info.mal_anime_publisher = swap_text( "none found, add some",               editor.lang.malgrabber.malGeneralValueNoneFound,        anime.mal_info.info.mal_anime_publisher );

                        anime.mal_info.info.mal_manga_authors = reverse_name( anime.mal_info.info.mal_manga_authors );

                        if ( anime.mal_list_staff ) {

                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffName_begin([^,]*?)staffName_end/g,         '<p class="mal_staff_name">$1</p>'            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffName_begin([^,]*?), *(.*?)staffName_end/g, '<p class="mal_staff_name">$2 $1</p>'         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffPosition_begin(.*?)staffPosition_end/g,    '<p class="mal_staff_position"><i>$1</i></p>' );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /,[^ ]/g,                                        ', '                                          );

                        anime.mal_list_staff = anime.mal_list_staff.replace( /mechanical design/gi,            editor.lang.malgrabber.malStaffValueMechanicalDesign           );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /production coordination/gi,      editor.lang.malgrabber.malStaffValueProductionCoordination     );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /assistant producer/gi,           editor.lang.malgrabber.malStaffValueAssistantProducer          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /assistant animation director/gi, editor.lang.malgrabber.malStaffValueAssistantAnimationDirector );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /digital paint/gi,                editor.lang.malgrabber.malStaffValueDigitalPaint               );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /original character design/gi,    editor.lang.malgrabber.malStaffValueOriginalCharacterDesign    );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /episode director/gi,             editor.lang.malgrabber.malStaffValueEpisodeDirector            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /sound director/gi,               editor.lang.malgrabber.malStaffValueSoundDirector              );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /storyboard/gi,                   editor.lang.malgrabber.malStaffValueStoryboard                 );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /animation director/gi,           editor.lang.malgrabber.malStaffValueAnimationDirector          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /key animation/gi,                editor.lang.malgrabber.malStaffValueKeyAnimation               );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /theme song arrangement/gi,       editor.lang.malgrabber.malStaffValueThemeSongArrangement       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /theme song performance/gi,       editor.lang.malgrabber.malStaffValueThemeSongPerformance       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /associate producer/gi,           editor.lang.malgrabber.malStaffValueAssociateProducer          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /co\-director/gi,                 editor.lang.malgrabber.malStaffValueCoDirector                 );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /assistant director/gi,           editor.lang.malgrabber.malStaffValueAssistantDirector          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /art director/gi,                 editor.lang.malgrabber.malStaffValueArtDirector                );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /animation director/gi,           editor.lang.malgrabber.malStaffValueAnimationDirector          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /in\-between animation/gi,        editor.lang.malgrabber.malStaffValueInBetweenAnimation         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /director of photography/gi,      editor.lang.malgrabber.malStaffValueDirectorofPhotography      );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /background art/gi,               editor.lang.malgrabber.malStaffValueBackgroundArt              );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /character design/gi,             editor.lang.malgrabber.malStaffValueCharacterDesign            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /sound effects/gi,                editor.lang.malgrabber.malStaffValueSoundEffects               );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /special effects/gi,              editor.lang.malgrabber.malStaffValueSpecialEffects             );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /production assistant/gi,         editor.lang.malgrabber.malStaffValueProductionAssistant        );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /color setting/gi,                editor.lang.malgrabber.malStaffValueColorSetting               );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /original creator/gi,             editor.lang.malgrabber.malStaffValueOriginalCreator            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /theme song lyrics/gi,            editor.lang.malgrabber.malStaffValueThemeSongLyrics            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /theme song composition/gi,       editor.lang.malgrabber.malStaffValueThemeSongComposition       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /series composition/gi,           editor.lang.malgrabber.malStaffValueSeriesComposition          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /inserted song performance/gi,    editor.lang.malgrabber.malStaffValueInsertedSongPerformance    );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /mechanical design/gi,            editor.lang.malgrabber.malStaffValueMechanicalDesign           );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /executive producer/gi,           editor.lang.malgrabber.malStaffValueExecutiveProducer          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /production manager/gi,           editor.lang.malgrabber.malStaffValueProductionManager          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /adr director/gi,                 editor.lang.malgrabber.malStaffValueADRDirector                );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /2nd key animation/gi,            editor.lang.malgrabber.malStaffValue2ndKeyAnimation            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /recording engineer/gi,           editor.lang.malgrabber.malStaffValueRecordingEngineer          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /producer/gi,                     editor.lang.malgrabber.malStaffValueProducer                   );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /director/gi,                     editor.lang.malgrabber.malStaffValueDirector                   );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /script/gi,                       editor.lang.malgrabber.malStaffValueScript                     );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /music/gi,                        editor.lang.malgrabber.malStaffValueMusic                      );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /setting/gi,                      editor.lang.malgrabber.malStaffValueSetting                    );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /screenplay/gi,                   editor.lang.malgrabber.malStaffValueScreenplay                 );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /editing/gi,                      editor.lang.malgrabber.malStaffValueEditing                    );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /planning/gi,                     editor.lang.malgrabber.malStaffValuePlanning                   );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /layout/gi,                       editor.lang.malgrabber.malStaffValueLayout                     );

                        anime.mal_list_staff =
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderStaff + '</b></p>'
                        +
                        '<div class="mal_text mal_list">'
                        +
                        anime.mal_list_staff
                        +
                        '</div>';

                        if ( anime.mal_list_staff.match( /staffName/ ) || anime.mal_list_staff.match( /staffPosition/ ) || anime.mal_list_staff.match( /no staff for this anime have been added to this title/i ) ) { anime.mal_list_staff = ""; }
                        }

                        if ( anime.mal_list_voice ) {

                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceCol_1_begin([^,]*?)MainvoiceCol_1_end/g,               '<p class="mal_voice_character">$1 - ' + editor.lang.malgrabber.malVoiceValueMain + '</p>'          );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceCol_1_begin([^,]*?), *(.*?)MainvoiceCol_1_end/g,       '<p class="mal_voice_character">$2 $1 - ' + editor.lang.malgrabber.malVoiceValueMain + '</p>'       );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceCol_1_begin([^,]*?)SupportingvoiceCol_1_end/g,         '<p class="mal_voice_character">$1 - ' + editor.lang.malgrabber.malVoiceValueSupporting + '</p>'    );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceCol_1_begin([^,]*?), *(.*?)SupportingvoiceCol_1_end/g, '<p class="mal_voice_character">$2 $1 - ' + editor.lang.malgrabber.malVoiceValueSupporting + '</p>' );

                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_1_begin([^,]*?)JapanesevoiceName_1_end/g,         '$1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')'    );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_1_begin([^,]*?), *(.*?)JapanesevoiceName_1_end/g, '$2 $1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')' );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_2_begin([^,]*?)JapanesevoiceName_2_end/g,         '$1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')'    );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_2_begin([^,]*?), *(.*?)JapanesevoiceName_2_end/g, '$2 $1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')' );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_3_begin([^,]*?)JapanesevoiceName_3_end/g,         '$1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')'    );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_3_begin([^,]*?), *(.*?)JapanesevoiceName_3_end/g, '$2 $1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')' );

                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_3_begin\.\.\.voiceName_3_end/g, ''       );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /(\))([A-Z])/g,                            '$1, $2' );

                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceCol_2_begin(.*?)voiceCol_2_end/g,                '<p class="mal_voice_name"><i>$1</i></p>'                 );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /(<p class="mal_voice_name"><i>)&nbsp;(<\/i><\/p>)/g, '$1' + editor.lang.malgrabber.malVoiceValueUnknown + '$2' );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /(<p class="mal_voice_name"><i>)(<\/i><\/p>)/g,       '$1' + editor.lang.malgrabber.malVoiceValueUnknown + '$2' );

                        anime.mal_list_voice =
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderVoice + '</b></p>'
                        +
                        '<div class="mal_text mal_list">'
                        +
                        anime.mal_list_voice
                        +
                        '</div>';

                        if ( anime.mal_list_voice.match( /voiceCol_[1-2]_(begin|end)/ ) || anime.mal_list_voice.match( /voiceName/ ) || anime.mal_list_voice.match( /no characters or voice actors have been added to this title/i ) ) { anime.mal_list_voice = ""; }
                        }

                        if ( anime.mal_list_characters ) {

                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?)Maincharacters_end/g,               '<p class="mal_list_characters">$1 - ' + editor.lang.malgrabber.malCharactersValueMain + '</p>'          );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?)Supportingcharacters_end/g,         '<p class="mal_list_characters">$1 - ' + editor.lang.malgrabber.malCharactersValueSupporting + '</p>'    );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?), *(.*?)Maincharacters_end/g,       '<p class="mal_list_characters">$2 $1 - ' + editor.lang.malgrabber.malCharactersValueMain + '</p>'       );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?), *(.*?)Supportingcharacters_end/g, '<p class="mal_list_characters">$2 $1 - ' + editor.lang.malgrabber.malCharactersValueSupporting + '</p>' );

                        if ( anime.mal_list_characters.match( /characters_(begin|end)/g ) ) { anime.mal_list_characters = ""; }

                        anime.mal_list_characters =
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeadeCharacters + '</b></p>'
                        +
                        '<div class="mal_text mal_list">'
                        +
                        anime.mal_list_characters
                        +
                        '</div>'; 
                        }

                        }
                        else
                        {

                        if ( anime.mal_list_staff ) {

                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffName_begin([^,]*?)staffName_end/g,         '<p class="mal_staff_name">$1</p>'            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffName_begin([^,]*?), *(.*?)staffName_end/g, '<p class="mal_staff_name">$2 $1</p>'         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffPosition_begin(.*?)staffPosition_end/g,    '<p class="mal_staff_position"><i>$1</i></p>' );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /,[^ ]/g,                                        ', '                                          );

                        anime.mal_list_staff =
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderStaff + '</b></p>'
                        +
                        '<div class="mal_text mal_list">'
                        +
                        anime.mal_list_staff
                        +
                        '</div>';

                        if ( anime.mal_list_staff.match( /staffName/ ) || anime.mal_list_staff.match( /staffPosition/ ) || anime.mal_list_staff.match( /no staff for this anime have been added to this title/i ) ) { anime.mal_list_staff = ""; }
                        }

                        if ( anime.mal_list_voice ) {

                        anime.mal_list_voice = anime.mal_list_voice.replace( /(voiceCol_1_begin)(.*?)(Main|Supporting)(voiceCol_1_end)/g, '$1$2 - $3$4' );

                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceCol_1_begin(.*?)voiceCol_1_end/g, '<p class="mal_voice_character">$1</p>' );

                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_1_begin(.*?)(Japanese)voiceName_1_end/g, '$1 ($2)' );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_2_begin(.*?)(Japanese)voiceName_2_end/g, '$1 ($2)' );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_3_begin(.*?)(Japanese)voiceName_3_end/g, '$1 ($2)' );

                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceName_3_begin\.\.\.voiceName_3_end/g, ''       );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /(\))([A-Z])/g,                            '$1, $2' );

                        anime.mal_list_voice = anime.mal_list_voice.replace( /voiceCol_2_begin(.*?)voiceCol_2_end/g,               '<p class="mal_voice_name"><i>$1</i></p>'                 );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /(<p class="mal_voice_name"><i>)&nbsp;(<\/i><\/p>)/g, '$1' + editor.lang.malgrabber.malVoiceValueUnknown + '$2' );
                        anime.mal_list_voice = anime.mal_list_voice.replace( /(<p class="mal_voice_name"><i>)(<\/i><\/p>)/g,       '$1' + editor.lang.malgrabber.malVoiceValueUnknown + '$2' );

                        anime.mal_list_voice =
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderVoice + '</b></p>'
                        +
                        '<div class="mal_text mal_list">'
                        +
                        anime.mal_list_voice
                        +
                        '</div>';

                        if ( anime.mal_list_voice.match( /voiceCol_[1-2]_(begin|end)/ ) || anime.mal_list_voice.match( /voiceName/ ) || anime.mal_list_voice.match( /no characters or voice actors have been added to this title/i ) ) { anime.mal_list_voice = ""; }
                        }

                        if ( anime.mal_list_characters ) {

                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?)Maincharacters_end/g,               '<p class="mal_list_characters">$1 - ' + editor.lang.malgrabber.malCharactersValueMain + '</p>'          );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?)Supportingcharacters_end/g,         '<p class="mal_list_characters">$1 - ' + editor.lang.malgrabber.malCharactersValueSupporting + '</p>'    );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?), *(.*?)Maincharacters_end/g,       '<p class="mal_list_characters">$2 $1 - ' + editor.lang.malgrabber.malCharactersValueMain + '</p>'       );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?), *(.*?)Supportingcharacters_end/g, '<p class="mal_list_characters">$2 $1 - ' + editor.lang.malgrabber.malCharactersValueSupporting + '</p>' );

                        if ( anime.mal_list_characters.match( /characters_(begin|end)/g ) ) { anime.mal_list_characters = ""; }

                        anime.mal_list_characters =
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeadeCharacters + '</b></p>'
                        +
                        '<div class="mal_text mal_list">'
                        +
                        anime.mal_list_characters
                        +
                        '</div>'; 
                        }

                        }



                        anime.mal_subject_source       = "";
                        anime.mal_subject_source_title = "";
                        anime.mal_subject_source_text  = "";

                        if ( custom_subject ) {

                            if ( custom_subject.match("\n")  ) {
                            custom_subject = custom_subject.replace(/(.*?)\n/g,"<p>$1</p>");
                            custom_subject = custom_subject.replace(/\n(.*?)/g,"<p>$1</p>");
                            custom_subject = custom_subject.replace(/\n(.*?)\n/g,"<p>$1</p>");
                            custom_subject = custom_subject.replace(/\n/g,"");
                            custom_subject = custom_subject.replace(/(<p>)(<\/p>)/g,"$1&nbsp;$2");
                            }

                        anime.mal_subject = custom_subject;

                            if ( custom_subject_source ) {

                            anime.mal_subject_source_title = "<b>" + editor.lang.malgrabber.malSubjectSource + "</b>";

                                if ( custom_subject_source_link ) {
                                anime.mal_subject_source_text = '<a target="_blank" href="' + custom_subject_source_link + '">' + custom_subject_source + '</a>';
                                }
                                else {
                                anime.mal_subject_source_text = custom_subject_source;
                                }
                            }

                        }

                        var
                        mal_created_date_org = anime.mal_created_date;

                            for ( i = 1; i <= 12; i++ ) {
                            anime.mal_created_date = swap_text( "(\/[^\/]*\-)(" + i + ")(\-[^\/]*\/)", '$1' + editor.lang.malgrabber['malDateMonths' + i] + '$3', anime.mal_created_date );
                            }

                            for ( i = 0; i <= 6; i++ ) {
                            anime.mal_created_date = swap_text( "(\/)(" + i + ")(\/)", '$1' + editor.lang.malgrabber['malDateDays' + i] + '$3', anime.mal_created_date );
                            }

                        anime.mal_created_date = swap_text( "\/([^\/]*)\-([^\/]*)\-([^\/]*)\/([^\/]*):([^\/]*)\/([^\/]*)\/", editor.lang.malgrabber.malDate, anime.mal_created_date );

                        $(".getDataMAL").removeClass("loaderMAL");


						if ( malSelect_logo ) {
						malSelect_logo.setStyle( 'background-image', "url(\'" + anime.displayed_icons_path + 'mal_logo.png' + "\')" );
						malSelect_logo.setStyle( 'background-repeat', "no-repeat" );
						}



                        if ( anime.mal_title && malSelect_title_text ) {
                		malSelect_title_text.setHtml( '<b>' + anime.mal_title + '</b>' );
                        }



                        if ( anime.mal_subject && malSelect_subject ) {
                        malSelect_subject.setHtml( anime.mal_subject );
                        }



                        if ( anime.mal_subject_source_title && anime.mal_subject_source_text ) {
                        malSelect_subject_source_title.setHtml( anime.mal_subject_source_title );
                        malSelect_subject_source_text.setHtml( anime.mal_subject_source_text );
                        }
                        else {
                        malSelect_subject_source.remove();
                        }



                        if ( malSelect_subject_title ) {
                        malSelect_subject_title.setHtml( '<b>' + editor.lang.malgrabber.malHeaderSubject + '</b>' );
                        }



                        if ( !anime.mal_list_voice && !anime.mal_list_staff && !anime.mal_list_characters ) {
                        malSelect_crew.remove();
                        }
                        else {
                        malSelect_crew.setHtml(
                        anime.mal_list_voice
                        +
                        anime.mal_list_staff
                        +
                        anime.mal_list_characters
                        );
                        }



                        if ( malSelect_info ) {
                        malSelect_info.setHtml(
						'<span class="mal_poster"><img src="' + anime.displayed_poster_path + anime.mal_poster + '"></span>'
                        +
                        '<br>'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderOtherNames + '</b></p>'
                        +
                        '<div class="mal_text">'
                        +
                        namer([
                        anime.mal_info.title.mal_title_alt,
                        anime.mal_info.title.mal_title_english,
                        anime.mal_info.title.mal_title_japanese,
                        anime.mal_info.title.mal_title_synonyms,
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
                        );
                        }



                        if ( anime.mal_created_date && malSelect_source ) {
                        malSelect_source.setHtml( '<i>' + anime.mal_created_date + '</i>' + '<a target="_blank" href="' + url + '" target="_blank">' + info_type + ' / ' + info_id + '</a>' );
                        }



                        }
                    }});

				}
				else {
				editor.showNotification( editor.lang.malgrabber.idError );
				$(".loaderMAL").remove();
				}
				}
			}
		} );



    }
});

CKEDITOR.on('dialogDefinition', function(e) {
    var dialogName = e.data.name;
    var dialogDefinition = e.data.definition;

    if ( dialogName == "malgrabber" ) {

        dialogDefinition.onShow = function() {
            var
            x_pos = this.getPosition().x,
            y_pos = window.innerHeight / 5;
            this.move(x_pos, y_pos);
        };
    }
});

function namer( t, h ) {
    var
    r = [],
    n = 0;

    for ( i = 0; i < t.length; i++ ) {
        if ( t[i] ) {        
        r[n] = '<p><b>' + h[i] + '</b>' + '<span>' + t[i] + '</span></p>';
        n = n + 1;
        }
    }

    return r.join( "" );
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

function escapeHTML( str ) {
    str = str.replace( '<', '&amp;lt;' );
    str = str.replace( '>', '&amp;gt;' );
    return str;
}

function reverse_name( str, split_char ) {
var s = str;
var r = "";
if ( s.match(",") ) {
split_str = s.split( '), ' );
   	for ( i = 0; i < split_str.length; i++ ) {
        if ( split_str[i].match(",") ) {
        r = r + split_str[i].replace( /(.*), (.*) (\(.*)/, '$2 $1 $3' );
        }
        else {
        r = r + split_str[i] + '';
        }
     if ( split_str.length != i - 1 ) { r = r + '), '; }
    }
    r = r.replace( ')),', ')' );
}
return r;
}