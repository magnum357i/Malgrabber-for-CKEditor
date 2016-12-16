/*
 *   @name                 Malgrabber
 *   @description          This is a plugin to get anime or manga information from MyAnimeList.
 *   @version              1.4.0
 *   @license              MIT-style license
 *   @author               Magnum357
 *   @download             https://github.com/magnum357i/Malgrabber-for-CKEditor
 */

CKEDITOR.plugins.add( 'malgrabber', {
    icons: 'malgrabber',
    lang:  'tr,en',
    init:  function( editor ) {

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

        editor.addCommand( 'malgrabber', new CKEDITOR.dialogCommand( 'malGrabberDialog' ) );

        editor.ui.addButton( 'malgrabber', {
            label:   editor.lang.malgrabber.button,
            command: 'malgrabber',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'malGrabberDialog', this.path + 'dialogs/malgrabber.js' );
    }
});