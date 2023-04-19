

function removeChildren(node) {
  if (node.hasChildNodes()) {
    while (node.childNodes.length >= 1) {
        node.removeChild(node.firstChild);
    }
  }
}

SendEventForm = function (id) {
  this.mId = id;
  this.mProperties = new Array();
  this.mDestinationPath;
  this.mEventPath;

  function _addField(parent, name, value, label, state) {
    var node;
	if ("hidden" == state) {
	} else {
      node = document.createElement('label');
      if (label) {
        node.appendChild(document.createTextNode(label + " "));
      }
      parent.appendChild(node);
      parent = node;
	}
    node = document.createElement('input');
    if ("hidden" == state) {
      node.setAttribute("type", "hidden");
    } else if ("disabled" == state) {
      node.setAttribute("disabled", "true");
    } else if ("readonly" == state) {
      node.setAttribute("readonly", "true");
	} else if ("password" == state) {
      node.setAttribute("type","password");
	}
    node.setAttribute("name", name);
    if (value) {
      node.setAttribute("value", value);
    }
    parent.appendChild(node);
  }

  function _addMultiLineField(parent, name, rows, value, label) {
    var node;
    node = document.createElement('label');
    if (label) {
      node.appendChild(document.createTextNode(label + " "));
    }
    parent.appendChild(node);
    parent = node;
    node = document.createElement('textarea');
    if (rows) {
      node.setAttribute("rows", rows);
    }
    node.setAttribute("name", name);
    if (value) {
	  node.appendChild(document.createTextNode(value));
    }
    parent.appendChild(node);
  }

  function _addPropertyField(parent, property, label, state) {
    var fieldName = property.name;
    if ("@" == fieldName.charAt(0)) {
      fieldName = "_" + fieldName.substr(1) + "_";
    }
    if (property.rows > 1) {
		if ("hidden" == state) {
			_addField(parent, fieldName, property.value, label, "hidden");
		} else if ("password" == state) {
			_addField(parent, fieldName, property.value, label, "password");
		} else {
			_addMultiLineField(parent, fieldName, property.rows, property.value, label, state);
		}
	} else {
		_addField(parent, fieldName, property.value, label, state);
	}
  }
  
  this.addProperty = function(name, value, rows, state) {
    var prop = new Object;
	prop.name = name;
	prop.value = value;
	prop.rows = rows;
	prop.state = state;
	this.mProperties[name] = prop;
  };

  this.targetName = "sendEventTarget";

  this.build = function() {
    var form = document.getElementById(this.mId);
    removeChildren(form);
    form.setAttribute("target", this.targetName);
    form.setAttribute("class", "sendEventForm " + form.className);
    form.setAttribute("action", SendEventForm.server + this.mDestinationPath);
    form.setAttribute("onSubmit", "SendEventForm.onSubmit(this)");

    var fieldset = document.createElement('fieldset');
    form.appendChild(fieldset);
    
    var target = document.getElementById(this.targetName);
    if (target) {
    } else {
      target = document.createElement("iframe");
      target.setAttribute("name", this.targetName);
      target.setAttribute("id", this.targetName);
      target.setAttribute("class", "sendEventFormTarget");
      document.body.appendChild(target);
    }

    var e;
    e = document.createElement('legend');
    e.appendChild(document.createTextNode(this.mEventPath));
    fieldset.appendChild(e);

    _addField(fieldset, "_ns_", "www.tibco.com/be/ontology" + this.mEventPath, null, "hidden");
    _addField(fieldset, "_nm_", this.mEventPath.substring(1 + this.mEventPath.lastIndexOf("/")), null, "hidden");

    var pre = document.createElement('pre');
    fieldset.appendChild(pre);

    var l = 0;
    for (var propName in this.mProperties){    
      if (propName.length > l) { l = propName.length; }
    }
    l;
    for (var propName in this.mProperties){    
	  var prop = this.mProperties[propName];
      _addPropertyField(pre, prop, prop.name, prop.state);
      pre.appendChild(document.createTextNode("\n"));
    }

    var p = document.createElement('p');
    e = document.createElement('button');
    e.setAttribute("type", "submit");
    e.appendChild(document.createTextNode("Send \u2192 "));    
    var span = document.createElement('span');
    span.setAttribute("class", "sendEventFormDestination");
    span.appendChild(document.createTextNode(SendEventForm.server + this.mDestinationPath));
    e.appendChild(span);
    p.appendChild(e);
    fieldset.appendChild(p);

    //form.setAttribute("onSubmit", "return sendEvent(this);");
	
	return fieldset;
  };

  this.getDestinationPath = function() {
    return this.mDestinationPath;
  };

  this.getEventPath = function() {
    return this.mEventPath;
  };

  this.setDestinationPath = function(path) {
    this.mDestinationPath = path;
  };

  this.setEventPath = function(path) {
    this.mEventPath = path;
  };

}


SendEventForm.get = function(id) {
    return new SendEventForm(id);
}


SendEventForm.getServer = function() {
  return SendEventForm.server;
}


SendEventForm.onSubmit = function(form) {
  // Prevents caching.
  var ridName = "_httprequestid_";
  var ridNode = form.elements[ridName];
  if (ridNode) {
  } else {
    ridNode = document.createElement('input');
    ridNode.setAttribute("type", "hidden");
    ridNode.setAttribute("name", ridName);
    form.appendChild(ridNode);
  }
  ridNode.value = new Date().getTime();
}


SendEventForm.setServer = function(url) {
  SendEventForm.server = url;
}


SendEventForm.setServer("http://localhost:80");

