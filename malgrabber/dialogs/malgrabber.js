CKEDITOR.dialog.add( 'malgrabber', function( editor ) {
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
                        items:      [ ['anime'], ['manga'] ],
                        setup:      function( widget ) { if ( !widget.data.type ) { this.setValue( 'anime' ); } else { this.setValue( widget.data.type ); } },
                        commit:     function( widget ) { widget.setData( 'type', this.getValue() ); },
                    },
                    {
                        id:         'id',
                        type:       'text',
                        label:      editor.lang.malgrabber.infoId,
                        labelStyle: 'font-weight: bold',
                        validate:   CKEDITOR.dialog.validate.notEmpty( editor.lang.malgrabber.infoIdValidate ),
                        setup:      function( widget ) { this.setValue( widget.data.id ); },
                        commit:     function( widget ) { widget.setData( 'id', this.getValue() ); },
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
                        setup:      function( widget ) { this.setValue( widget.data.title ); },
                        commit:     function( widget ) { widget.setData( 'title', this.getValue() ); },
                    },
                    {
                        id:    'subject',
                        type:  'textarea',
                        rows:  '10',
                        label: editor.lang.malgrabber.customSubject,
                        setup:  function( widget ) { this.setValue( widget.data.subject ); },
                        commit: function( widget ) { widget.setData( 'subject', this.getValue() ); },
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
                            setup:      function( widget ) { this.setValue( widget.data.subject_source ); },
                            commit:     function( widget ) { widget.setData( 'subject_source', this.getValue() ); },
                        },
                        {
                            id:         'subject_source_link',
                            type:       'text',
                            inputStyle: 'margin-bottom: 10px',
                            label:      editor.lang.malgrabber.customSourceLink,
                            setup:      function( widget ) { this.setValue( widget.data.subject_source_link ); },
                            commit:     function( widget ) { widget.setData( 'subject_source_link', this.getValue() ); },
                        },
                    ],
                    },
                ],
            },
            ],
    };
} );