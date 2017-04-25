// @flow

import fs from 'fs'
import del from 'del'
import iosHeaderCreator from './objective-c-header-creator'
import schema from 'protocol-buffers-schema'
import ios from './objective-c-parser'
import flowTypes from './flow-type-generator'
import reactActionCreators from './react-action-creator-generator'
import actionTypes from './react-action-types-generator'
import apiClient from './react-native-api-client-generator'
import indexGen from './index-generator'
import { fileName, jsFileName } from './utils'

export default (protoFile: string) => {
  const file = fs.readFileSync(protoFile, 'utf-8')
  const fileSchema = schema.parse(file)
  const protoFileName = fileSchema.services[0].name
  const iosBridgeFile = ios(fileSchema)
  const iosBridgeHeaderFile = iosHeaderCreator(protoFileName)

  if (!fs.existsSync('output')) {
    fs.mkdirSync('output')
  } else {
    del.sync(['output/**'])
    fs.mkdirSync('output')
    fs.mkdirSync('output/js')
    fs.mkdirSync('output/ios')
  }

  fs.writeFileSync(`output/ios/${fileName(protoFileName)}.h`, iosBridgeHeaderFile, {encoding: 'utf-8'})
  fs.writeFileSync(`output/ios/${fileName(protoFileName)}.m`, iosBridgeFile, {encoding: 'utf-8'})
  fs.writeFileSync(`output/js/${jsFileName(protoFileName)}-flow-types.js`, flowTypes(fileSchema), {encoding: 'utf-8'})
  fs.writeFileSync(`output/js/${jsFileName(protoFileName)}-actions.js`, reactActionCreators(fileSchema), {encoding: 'utf-8'})
  fs.writeFileSync(`output/js/${jsFileName(protoFileName)}-action-types.js`, actionTypes(fileSchema), {encoding: 'utf-8'})
  fs.writeFileSync(`output/js/${jsFileName(protoFileName)}-react-native-api-client.js`, apiClient(fileSchema), {encoding: 'utf-8'})
  fs.writeFileSync(`output/js/index.js`, indexGen(fileSchema), {encoding: 'utf-8'})
}
