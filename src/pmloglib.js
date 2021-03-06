// @@@LICENSE
//
//  Copyright (c) 2010-2013 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// LICENSE@@@

(function(target) {
	function makeLogFunction (messageLevel, msgId) {
		function logImplementation () {
			var stringToLog;
			var args = [],i,count=arguments.length;
			for(i = 0; i < count; ++i) {
				args.push(arguments[i]);
			}
			var formatString = args.shift();
			if (formatString) {
				// make sure the format string is in fact a string
				formatString = "" + formatString;
				var nextArgument = function(stringToReplace) {
					var target;
					if (stringToReplace === "%%") {
						return  "%";
					}

					target = args.shift();
					switch (stringToReplace) {
					case "%j":
						return JSON.stringify(target);
					}

					return target;
				};
				var resultString = formatString.replace(/%[jsdfio%]/g, nextArgument);
				stringToLog = [resultString].concat(args).join(" ");
				target._logString(target.name||"<>", messageLevel, msgId, stringToLog);
			}
			return stringToLog;
		}
		return logImplementation;
	}
	target.error = makeLogFunction(target.LOG_ERR, "console.error");
	target.warn = makeLogFunction(target.LOG_WARNING, "console.warn");
	target.info = makeLogFunction(target.LOG_INFO, "console.info");
	target.log = makeLogFunction(target.LOG_INFO, "console.log");
	target.Context = function(name) {
		this.contextName = name;
	};
	target.Context.prototype.log = function(level, msgId, keyValues, freeText) {
		if (typeof level !== "number") {
			throw "level must be a number";
		}
		if (level !== target.LOG_DEBUG) {
			// There are many ways to check this, all of which have various limitations
			// This version catches the most common errors
			if (!msgId || typeof msgId !== "string") {
				throw "msgId is required for info and higher log levels";
			}
		}
		if (keyValues && typeof keyValues !== "object") {
			throw "keyValues must be an object, or undefined/null";
		}
		target._logKeyValueString(this.contextName, level, msgId, JSON.stringify(keyValues), freeText);
	};
	target.Console = function(name) {
		this.contextName = name;
	};
	target.Console.prototype.error = function() {
		target.name = this.contextName;
		target.error.apply(target, arguments);
	};
	target.Console.prototype.warn = function() {
		target.name = this.contextName;
		target.warn.apply(target, arguments);
	};
	target.Console.prototype.info = function() {
		target.name = this.contextName;
		target.info.apply(target, arguments);
	};
	target.Console.prototype.log = function() {
		target.name = this.contextName;
		target.log.apply(target, arguments);
	};
});

