var defaultWhiteList = [
	{
		tag: "p",
		attribs: [{
			name: "align",
			value: '(center|left|right)'
		}]
	},
	{tag: "h1", replacement:"h2"},
	{tag: "h2"},
	{tag: "h3"},
	{tag: "h4"},
	{tag: "h5"},
	{tag: "h6"},
	{tag: "section"},
	{tag: "div", attribs:[{name:"class", value:"(.+?)"}]},
	{tag: "strong"},
	{tag: "b"},
	{tag: "u"},
	{tag: "i"},
	{tag: "em"},
	{tag: "ul"},
	{tag: "li"},
	{tag: "ol"},
	{tag: "dl"},
	{tag: "dd"},
	{tag: "dt"},
	{tag: 'br'},
	{tag: 'hr'},
	{tag: "table", attribs:[{name:'border', value:'[0-3]'},{name:'cellpadding', value:'[0-3]'},{name:'cellspacing', value:'[0-3]'}]},
	{tag: "thead"},
	{tag: "tbody"},
	{tag: "th"},
	{tag: "tr"},
	{tag: "td"}
]

exports.sanitize = function(html, whitelist){
	
	if (! whitelist) whitelist = defaultWhiteList
	
	var tagMap = {}
	for (var t in whitelist){ // create a map of whitelisted tags for easy searching
		tagMap[whitelist[t].tag] = whitelist[t]
	}
	
	var reTag = /<([^>]*)>/gi, nextTagMatch, openTags = [], index, out = "", pos = 0, tagName, tagData, attribString, attribMatch, reAttrib, tagRE = /^(\/)?([a-zA-Z0-9]+)([^>]*)?$/ ;
	
	while (nextTagMatch = reTag.exec(html)){
		out += html.substring(pos, nextTagMatch.index)
		tagStr = nextTagMatch[1]
		tagMatch = tagRE.exec(tagStr)
		if (tagMatch){
			tagName = tagMatch[2].toLowerCase()
			if (tagMap[tagName]) { // tag is authorized
				tagData = tagMap[tagName]
				if (tagMatch[1] && tagMatch[1] == "/") {
					var index = openTags.indexOf(tagName)
					if (index > -1) { // tag has matching opening tag
						out += "</"
						openTags.splice(index, 1)
					}
					else {
						// position cursor after closing tag
						pos = nextTagMatch.index + nextTagMatch[0].length
						continue
					}
				}
				else {
					// opening tag
					out += "<"
					openTags.push(tagName)
				}
					
				if (tagData.replacement) tagName = tagData.replacement
				out += tagName
				if (tagData.attribs && !tagMatch[1]) {
					// validate attributes
					attribString = tagMatch[3]
					for (var a in tagData.attribs){
						reAttrib = new RegExp(tagData.attribs[a].name+"=(['\"]?)"+tagData.attribs[a].value+"(\\1|$)")
						attribMatch = reAttrib.exec(attribString)
						if (attribMatch){ // attribute is valid
							out += " " + attribMatch[0]
						}
					}
				}
				out += ">"
				
			}
		}
		
		pos = nextTagMatch.index + nextTagMatch[0].length
		
	}
	if (pos < html.length) out += html.substr(pos, html.length-pos)
	// close remaining open tags
	for (var i=0; i < openTags.length; i++) {
		if (tagMap[openTags[i]].replacement) out += "</" + tagMap[openTags[i]].replacement + ">"
		else out += "</" + openTags[i] + ">"
	}
	
	return out
	
}




