/**
 * 
 * 
 */
//Dependencies
const fs = require('fs'),
      path = require('path'),
      config = require('../../../lib/config');

//end dependencies
//Paths
var templateDir = path.join(__dirname,'/../' );

 const inject = {
    /************helpers for HTML************* */
      // get the string content of a template  
      getTemplate: (templateName,  data, callback)=>{
        templateName = typeof(templateName) === 'string' && templateName.length > 0 ? templateName : '';

        if(templateName) {

          fs.readFile(templateDir+'_header.html','utf8', (err, header)=>{
            if(!err && header && header.length > 0){

              fs.readFile(templateDir+templateName+'.html', 'utf-8', (err, mainTemplate)=>{
                if(!err && mainTemplate && mainTemplate.length > 0){

                  fs.readFile(templateDir+'_footer.html', 'utf-8', (err, footer)=>{

                    if(!err && footer && footer.length > 0){
                      var replaceTemplate = header + mainTemplate + footer;

                      var template = inject.interpolate(replaceTemplate, data);

                      callback(false, template);

                     } else {
                      callback('Footer template could be found');
                    }                    
                  });
                } else {
                  callback('MainTemplate template could be found');
                }
              });
            } else {
              callback('Header template could be found');
            }
          });
          
        } else {
          callback('A valid template name is not specified');
        }
      },

      // Take a given string and data object and replace it
      interpolate: (template, data)=>{
        template = typeof(template) === 'string' && template.length > 0 ? template : '';
        data = typeof(data) === 'object' && data !== null ? data : {};
        //add the templates global 
        for (const key in config.templateGlobals) {
          if (config.templateGlobals.hasOwnProperty(key)) {
            let find = '{global_'+key+'}';
            let replace = config.templateGlobals[key];  
            template =  template.replace(find, replace);   
          }
        }

      // take the string from objet and replace
        for (const key in data) {
          if (data.hasOwnProperty(key) && typeof(data[key] === 'string')) {      
            let replace = data[key];
            let find = '{'+key+'}';
            template = template.replace(find, replace);
          }
        }
        return template;

      }

 }

 module.exports = inject;