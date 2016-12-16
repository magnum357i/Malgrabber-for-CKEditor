CKEDITOR.dialog.add( 'malGrabberDialog', function( editor ) {
    return {
        minWidth:  350,
        minHeight: 50,
        title:     editor.lang.malgrabber.title,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents:  [
        {
                id:       'info',
                label:    editor.lang.malgrabber.tabName1,
                elements: [
                {
                    type:     'hbox',
                    widths:   [ '50%', '50%' ],
                    children: [
                    {
                        id:         'type',
                        type:       'select',
                        inputStyle: 'width: 165px',
                        label:      editor.lang.malgrabber.infoType,
                        labelStyle: 'font-weight: bold',
                        'default':  'anime',
                        items:      [ ['anime'], ['manga'] ],
                    },
                    {
                        id:         'id',
                        type:       'text',
                        label:      editor.lang.malgrabber.infoId,
                        labelStyle: 'font-weight: bold',
                        validate:   CKEDITOR.dialog.validate.notEmpty( editor.lang.malgrabber.infoIdValidate ),
                    },
                    ],
                },
                ]
            },
            {
                id:       'custom',
                label:    editor.lang.malgrabber.tabName2,
                elements: [
                    {
                        id:         'title',
                        type:       'text',
                        inputStyle: 'margin-bottom: 10px',
                        label:      editor.lang.malgrabber.customTitle,
                    },
                    {
                        id:    'subject',
                        type:  'textarea',
                        rows:  '4',
                        label: editor.lang.malgrabber.customSubject,
                    },
                    {
                        type:     'hbox',
                        widths:   [ '70%', '30%' ],
                        children: [
                        {
                            id:         'subject_source',
                            type:       'text',
                            inputStyle: 'margin-bottom: 10px',
                            label:      editor.lang.malgrabber.customSource,
                        },
                        {
                            id:         'subject_source_link',
                            type:       'text',
                            inputStyle: 'margin-bottom: 10px',
                            label:      editor.lang.malgrabber.customSourceLink,
                        },
                    ],
                    },
                ],
            },

            ],

        onOk: function() {
        var
        dialog                     = this,
        info_type                  = dialog.getValueOf( 'info', 'type'                                ),
        info_id                    = parseInt( dialog.getValueOf( 'info', 'id' )                      ),
        custom_title               = dialog.getValueOf( 'custom', 'title'                             ),
        custom_subject             = escapeHTML( dialog.getValueOf( 'custom', 'subject' )             ),
        custom_subject_source      = escapeHTML( dialog.getValueOf( 'custom', 'subject_source' )      ),
        custom_subject_source_link = escapeHTML( dialog.getValueOf( 'custom', 'subject_source_link' ) );

            if( Number.isInteger( info_id ) ) {
            var
            base_path = CKEDITOR_BASEPATH + '/plugins/malgrabber/',
            url     = 'https://myanimelist.net/' + info_type + '/' + info_id,
            loading = editor.document.createElement( 'div' );

            loading.setAttribute( "id", "loadingMAL" );
            loading.setHtml( '<img src=' + base_path + 'icons/ajax-loader.gif>' );
            editor.insertElement( loading );

                jQuery.ajax( {
                url: base_path + "json.php",
                data: "url=" + url + '&custom_title=' + custom_title + '&defualt_timezone=' + editor.lang.malgrabber.langTimeZone,
                type: "POST",
                    success: function( data ){
                    editor.document.getById( 'loadingMAL' ).remove();

                        if      ( data.match( /[0-9]+,[0-9]+,[0-9]+/ ) ) {
                        data = data.replace( /[^0-9,]+/, '' );

                        var
                        l_lhm      = data.split( ',' ),
                        limitError = editor.lang.malgrabber.limitError;


                        for ( i = 0; i < l_lhm.length; i++ ) { limitError = limitError.replace( '$' + (i + 1), l_lhm[i] ); }

                        editor.showNotification( limitError );

                        }
                        else if ( data.match( "poster size is too big" ) )       { editor.showNotification( editor.lang.malgrabber.posterSizeError   ); }
                        else if ( data.match( "poster folder is not created" ) ) { editor.showNotification( editor.lang.malgrabber.posterFolderError ); }
                        else if ( data.match( "missing data" ) )                 { editor.showNotification( editor.lang.malgrabber.missingData       ); }
                        else{
                        var anime = JSON.parse( data ),
                        mal_div   = editor.document.createElement( 'div' );

                        mal_div.setAttribute( 'class', 'getDataMAL' );

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
                        anime.mal_info.info.mal_date            = swap_text( "jan +([0-9]*)",            editor.lang.malgrabber.malDateValueJan2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "feb +([0-9]*)",            editor.lang.malgrabber.malDateValueFeb2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "mar +([0-9]*)",            editor.lang.malgrabber.malDateValueMar2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "apr +([0-9]*)",            editor.lang.malgrabber.malDateValueApr2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "may +([0-9]*)",            editor.lang.malgrabber.malDateValueMay2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "jun +([0-9]*)",            editor.lang.malgrabber.malDateValueJun2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "jul +([0-9]*)",            editor.lang.malgrabber.malDateValueJul2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "aug +([0-9]*)",            editor.lang.malgrabber.malDateValueAug2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "sep +([0-9]*)",            editor.lang.malgrabber.malDateValueSep2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "oct +([0-9]*)",            editor.lang.malgrabber.malDateValueOct2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "nov +([0-9]*)",            editor.lang.malgrabber.malDateValueNov2,                anime.mal_info.info.mal_date            );
                        anime.mal_info.info.mal_date            = swap_text( "dec +([0-9]*)",            editor.lang.malgrabber.malDateValueDec2,                anime.mal_info.info.mal_date            );
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


						anime.mal_info.info.mal_anime_publisher = swap_text( "none found, add some",     editor.lang.malgrabber.malGeneralValueNoneFound,        anime.mal_info.info.mal_anime_publisher );

                        anime.mal_info.info.mal_manga_authors = reverse_name( anime.mal_info.info.mal_manga_authors );

                        if ( anime.mal_list_staff ) {

                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffName_begin([^,]*?)staffName_end/g,         '<p class="mal_staff_name">$1</p>'            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffName_begin([^,]*?), *(.*?)staffName_end/g, '<p class="mal_staff_name">$2 $1</p>'         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /staffPosition_begin(.*?)staffPosition_end/g,    '<p class="mal_staff_position"><i>$1</i></p>' );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /,[^ ]/g,                                        ', '                                          );

                        anime.mal_list_staff = anime.mal_list_staff.replace( /original character design/gi, editor.lang.malgrabber.malStaffValueOriginalCharacterDesign );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /episode director/gi,          editor.lang.malgrabber.malStaffValueEpisodeDirector         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /sound director/gi,            editor.lang.malgrabber.malStaffValueSoundDirector           );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /storyboard/gi,                editor.lang.malgrabber.malStaffValueStoryboard              );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /animation director/gi,        editor.lang.malgrabber.malStaffValueAnimationDirector       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /key animation/gi,             editor.lang.malgrabber.malStaffValueKeyAnimation            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /theme song arrangement/gi,    editor.lang.malgrabber.malStaffValueThemeSongArrangement    );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /theme song performance/gi,    editor.lang.malgrabber.malStaffValueThemeSongPerformance    );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /associate producer/gi,        editor.lang.malgrabber.malStaffValueAssociateProducer       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /co\-director/gi,              editor.lang.malgrabber.malStaffValueCoDirector              );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /assistant director/gi,        editor.lang.malgrabber.malStaffValueAssistantDirector       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /art director/gi,              editor.lang.malgrabber.malStaffValueArtDirector             );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /animation director/gi,        editor.lang.malgrabber.malStaffValueAnimationDirector       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /in\-between animation/gi,     editor.lang.malgrabber.malStaffValueInBetweenAnimation      );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /director of photography/gi,   editor.lang.malgrabber.malStaffValueDirectorofPhotography   );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /background art/gi,            editor.lang.malgrabber.malStaffValueBackgroundArt           );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /character design/gi,          editor.lang.malgrabber.malStaffValueCharacterDesign         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /sound effects/gi,             editor.lang.malgrabber.malStaffValueSoundEffects            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /special effects/gi,           editor.lang.malgrabber.malStaffValueSpecialEffects          );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /production assistant/gi,      editor.lang.malgrabber.malStaffValueProductionAssistant     );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /color setting/gi,             editor.lang.malgrabber.malStaffValueColorSetting            );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /original creator/gi,          editor.lang.malgrabber.malStaffValueOriginalCreator         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /theme song lyrics/gi,         editor.lang.malgrabber.malStaffValueThemeSongLyrics         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /theme song composition/gi,    editor.lang.malgrabber.malStaffValueThemeSongComposition    );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /series composition/gi,        editor.lang.malgrabber.malStaffValueSeriesComposition       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /inserted song performance/gi, editor.lang.malgrabber.malStaffValueInsertedSongPerformance );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /executive producer/gi,        editor.lang.malgrabber.malStaffValueExecutiveProducer       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /production manager/gi,        editor.lang.malgrabber.malStaffValueProductionManager       );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /adr director/gi,              editor.lang.malgrabber.malStaffValueADRDirector             );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /producer/gi,                  editor.lang.malgrabber.malStaffValueProducer                );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /director/gi,                  editor.lang.malgrabber.malStaffValueDirector                );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /script/gi,                    editor.lang.malgrabber.malStaffValueScript                  );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /music/gi,                     editor.lang.malgrabber.malStaffValueMusic                   );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /setting/gi,                   editor.lang.malgrabber.malStaffValueSetting                 );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /screenplay/gi,                editor.lang.malgrabber.malStaffValueScreenplay              );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /editing/gi,                   editor.lang.malgrabber.malStaffValueEditing                 );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /planning/gi,                  editor.lang.malgrabber.malStaffValuePlanning                );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /2nd key animation/gi,         editor.lang.malgrabber.malStaffValue2ndKeyAnimation         );
                        anime.mal_list_staff = anime.mal_list_staff.replace( /recording engineer/gi,        editor.lang.malgrabber.malStaffValueRecordingEngineer       );

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

                        if ( anime.mal_list_staff.match(/staffName/) || anime.mal_list_staff.match(/staffPosition/) || anime.mal_list_staff.match(/no staff for this anime have been added to this title/i) ) { anime.mal_list_staff = ""; }
                        }

                        if ( anime.mal_list_voice ) {

                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceCol_1_begin([^,]*?)MainvoiceCol_1_end/g,               '<p class="mal_voice_character">$1 - ' + editor.lang.malgrabber.malVoiceValueMain + '</p>'          );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceCol_1_begin([^,]*?), *(.*?)MainvoiceCol_1_end/g,       '<p class="mal_voice_character">$2 $1 - ' + editor.lang.malgrabber.malVoiceValueMain + '</p>'       );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceCol_1_begin([^,]*?)SupportingvoiceCol_1_end/g,         '<p class="mal_voice_character">$1 - ' + editor.lang.malgrabber.malVoiceValueSupporting + '</p>'    );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceCol_1_begin([^,]*?), *(.*?)SupportingvoiceCol_1_end/g, '<p class="mal_voice_character">$2 $1 - ' + editor.lang.malgrabber.malVoiceValueSupporting + '</p>' );

                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_1_begin([^,]*?)JapanesevoiceName_1_end/g,         '$1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')'    );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_1_begin([^,]*?), *(.*?)JapanesevoiceName_1_end/g, '$2 $1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')' );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_2_begin([^,]*?)JapanesevoiceName_2_end/g,         '$1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')'    );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_2_begin([^,]*?), *(.*?)JapanesevoiceName_2_end/g, '$2 $1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')' );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_3_begin([^,]*?)JapanesevoiceName_3_end/g,         '$1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')'    );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_3_begin([^,]*?), *(.*?)JapanesevoiceName_3_end/g, '$2 $1 (' + editor.lang.malgrabber.malVoiceValueJapanese + ')' );

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

                        if ( anime.mal_list_voice.match(/voiceCol_[1-2]_(begin|end)/) || anime.mal_list_voice.match(/voiceName/) || anime.mal_list_voice.match(/no characters or voice actors have been added to this title/i) ) { anime.mal_list_voice = ""; }
                        }

                        if ( anime.mal_list_characters ) {

                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?)Maincharacters_end/g,               '<p class="mal_list_characters">$1 - ' + editor.lang.malgrabber.malCharactersValueMain + '</p>'          );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?)Supportingcharacters_end/g,         '<p class="mal_list_characters">$1 - ' + editor.lang.malgrabber.malCharactersValueSupporting + '</p>'    );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?), *(.*?)Maincharacters_end/g,       '<p class="mal_list_characters">$2 $1 - ' + editor.lang.malgrabber.malCharactersValueMain + '</p>'       );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?), *(.*?)Supportingcharacters_end/g, '<p class="mal_list_characters">$2 $1 - ' + editor.lang.malgrabber.malCharactersValueSupporting + '</p>' );

                        if ( anime.mal_list_characters.match(/characters_(begin|end)/g) ) { anime.mal_list_characters = ""; }

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

                        if ( anime.mal_list_staff.match(/staffName/) || anime.mal_list_staff.match(/staffPosition/) || anime.mal_list_staff.match(/no staff for this anime have been added to this title/i) ) { anime.mal_list_staff = ""; }
                        }

                        if ( anime.mal_list_voice ) {

                        anime.mal_list_voice = anime.mal_list_voice.replace(/(voiceCol_1_begin)(.*?)(Main|Supporting)(voiceCol_1_end)/g, '$1$2 - $3$4' );

                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceCol_1_begin(.*?)voiceCol_1_end/g, '<p class="mal_voice_character">$1</p>' );

                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_1_begin(.*?)(Japanese)voiceName_1_end/g, '$1 ($2)' );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_2_begin(.*?)(Japanese)voiceName_2_end/g, '$1 ($2)' );
                        anime.mal_list_voice = anime.mal_list_voice.replace(/voiceName_3_begin(.*?)(Japanese)voiceName_3_end/g, '$1 ($2)' );

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

                        if ( anime.mal_list_voice.match(/voiceCol_[1-2]_(begin|end)/) || anime.mal_list_voice.match(/voiceName/) || anime.mal_list_voice.match(/no characters or voice actors have been added to this title/i) ) { anime.mal_list_voice = ""; }
                        }

                        if ( anime.mal_list_characters ) {

                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?)Maincharacters_end/g,               '<p class="mal_list_characters">$1 - ' + editor.lang.malgrabber.malCharactersValueMain + '</p>'          );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?)Supportingcharacters_end/g,         '<p class="mal_list_characters">$1 - ' + editor.lang.malgrabber.malCharactersValueSupporting + '</p>'    );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?), *(.*?)Maincharacters_end/g,       '<p class="mal_list_characters">$2 $1 - ' + editor.lang.malgrabber.malCharactersValueMain + '</p>'       );
                        anime.mal_list_characters = anime.mal_list_characters.replace( /characters_begin([^,]*?), *(.*?)Supportingcharacters_end/g, '<p class="mal_list_characters">$2 $1 - ' + editor.lang.malgrabber.malCharactersValueSupporting + '</p>' );

                        if ( anime.mal_list_characters.match(/characters_(begin|end)/g) ) { anime.mal_list_characters = ""; }

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

                        if ( custom_subject ) {

                            if ( custom_subject_source ) {
                                if ( custom_subject_source_link ) {
                                custom_subject = custom_subject + "<br><br>" + '<div class="mal_subject_source">' + "(" + editor.lang.malgrabber.malSubjectSource + '<a target="_blank" href="' + custom_subject_source_link + '">' + custom_subject_source + '</a>' + ")" + '</div>';
                                }
                                else {
                                custom_subject = custom_subject + "<br><br>" + '<div class="mal_subject_source">' + "(" + editor.lang.malgrabber.malSubjectSource + custom_subject_source + ")" + '</div>';
                                }
                            }

                        anime.mal_subject.mal_subject = custom_subject;
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

                        var mal_html =
                        '<div class="mal_title">'
                        +
                        '<div class="mal_title_text"><b>' + anime.mal_title + '</b></div>'
                        +
                        '<div class="mal_logo" style="background-image:url(\'' + anime.displayed_icons_path + 'mal_logo.png' + '\');background-size:127px 50px;background-repeat:no-repeat;"></div>'
                        +
                        '</div>'
                        +
                        '<div class="mal_content">'
                        +
                        '<div class="mal_subject">'
                        +
                        '<p class="mal_header"><b>' + editor.lang.malgrabber.malHeaderSubject + '</b></p>'
                        +
                        '<div class="mal_text">'
                        +
                        anime.mal_subject.mal_subject
                        +
                        '</div>'
                        +
                        anime.mal_list_voice
                        +
                        anime.mal_list_staff
                        +
                        anime.mal_list_characters
                        +
                        '</div>'
                        +
                        '<div class="mal_info">'
                        +
                        '<span class="mal_poster"><img src="' + anime.displayed_poster_path + anime.mal_poster + '"></span>'
                        +
                        '<br>'
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
                        '<div class="mal_source">' + '<i>' + anime.mal_created_date + '</i>' + '<a target="_blank" href="' + url + '" target="_blank">' + info_type + ' / ' + info_id + '</a>' + '</div>';

                        mal_div.setHtml( mal_html );

                        editor.insertElement( mal_div );
                        }
                    }
                });
            }
            else {
            editor.showNotification( editor.lang.malgrabber.idError );
            }
        },
    };
} );

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
    str = str.replace( /\n/g, '<br>' );
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