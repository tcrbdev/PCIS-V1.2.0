import React, { Component } from 'react'
import FilesUpload from '../../components/filesupload/files_upload'
import { message } from 'antd'

class FilesManagement extends Component {

    state = {
        files: [],
        config: {}
    }

    fileUpload = (files) => {
        let uniqueFiles = []
        files.forEach((value) => {        
            if (!this.in_array(value.name, uniqueFiles)) uniqueFiles.push(value)            
        })

        this.setState({ files: uniqueFiles })

    }

    in_array = (needle, haystack, argStrict) => {

        var key = '', strict = !!argStrict;

        if (strict) {
            for (key in haystack) {
                if (haystack[key] === needle) {
                    return true
                }
            }
        } else {
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true
                }
            }
        }

        return false

    }

    render() {

        this.state.config = {
            name: 'file',
            multiple: true,
            showUploadList: true,
            action: '//jsonplaceholder.typicode.com/posts/',
            onChange: (info) => {

                const status = info.file.status;
                if (status !== 'uploading') console.log(info.file, info.fileList)
                if (status === 'done') {
                    this.fileUpload(info.fileList)
                    message.success(`${info.file.name} file uploaded successfully.`)

                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`)

                }

            }
        };

        return (
            <FilesUpload
                files={this.state.files}
                config={this.state.config}
            />
        )

    }

}

export default FilesManagement