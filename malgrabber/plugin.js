/*
 * Malgrabber
 *
 * @version     1.2b
 * @license     MIT-style license
 * @author      Magnum357
 * @copyright   Author
 * 
 */

CKEDITOR.plugins.add( 'malgrabber', {
    icons: 'malgrabber',
    lang: 'tr,en',
    init: function( editor ) {

        CKEDITOR.addCss(
          '.getDataMAL .mal_content{background:#e1e7f5;display:flex;}'
        + '.getDataMAL .mal_title{background:#1d439b;color:white;padding:10px;text-align:left !important;}'
        + '.getDataMAL .mal_poster img{max-width:none;margin-right:10px;border:1px solid #b0b0b0;}'
        + '.getDataMAL .mal_poster {float:left;}'
        + '.getDataMAL .mal_info{background:#F6F6F6;border:1px solid #b0b0b0;height:100%;padding:10px;margin:10px 10px 10px 0px;width:350px;}'
        + '.getDataMAL .mal_header{border-bottom:1px solid #b0b0b0;display:flex;margin:0px 0px 5px 0px;padding:0;}'
        + '.getDataMAL .mal_info .mal_header{border-color:#d0d0d0;}'
        + '.getDataMAL .mal_subject{margin:10px;width:100%;text-align:justify;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;hyphens:auto;}'
        + '.getDataMAL .mal_source{background:#d4e1ff;padding:1px 10px 1px 1px;border-bottom:1px solid #1d439b;width:100%;text-align:right !important;}'
        + '.getDataMAL{width:100%;}'
        + '.getDataMAL div.mal_text{text-align:left !important;}'
        + '@media screen and (max-width:1000px) {.getDataMAL .mal_poster, .getDataMAL .mal_info{display:none;}}'
        );

        editor.addCommand( 'malgrabber', new CKEDITOR.dialogCommand( 'malGrabberDialog' ) );

        editor.ui.addButton( 'malgrabber', {
            label: editor.lang.malgrabber.button,
            command: 'malgrabber',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'malGrabberDialog', this.path + 'dialogs/malgrabber.js' );
    }
});