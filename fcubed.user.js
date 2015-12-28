// ==UserScript==
// @name         f-cubed
// @namespace    http://gitlab.com/n4ru/
// @version      0.1.337
// @description  Discover eligible portals for flash frack farming.
// @author       Thirkins
// @match        http://tampermonkey.net/scripts.php
// @grant        none
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var oldpd = '';
var fac = window.PLAYER.team[0];
var opp = ((window.PLAYER.team[0] == 'E') ? 'R' : 'E');

$('#portaldetails').on('DOMNodeInserted', function() {
	if (portalDetail.get(selectedPortal).title != oldpd) {
		oldpd = '';
	}
	if (portalDetail.get(selectedPortal).resonators.length == 8 && portalDetail.get(selectedPortal).mods.length == 4) {
		var count = 0;
		var mods = {
			'empty': 0,
			'vrhs': 0,
			'vrmh': 0,
			'rhs': 0
		}
		portalDetail.get(selectedPortal).mods.forEach(function(themod) {
			if (themod != null) {
				if (themod.hasOwnProperty('name')) {
					switch ([themod.name, themod.rarity].join()) {
						case "Heat Sink,VERY_RARE":
							mods.vrhs++;
							break;
						case "Heat Sink,RARE":
							mods.rhs++;
							break;
						case "Multi-hack,VERY_RARE":
							mods.vrmh++;
							break;
					}
				}
			} else {
				mods.empty++
			}
		})
		if (mods.rhs > 0 && mods.vrhs > 0 && (mods.empty > 0 || mods.vrmh > 0)) {
			mods.empty += mods.rhs;
			mods.rhs = 0;
		}
		if (mods.vrmh <= 3 && mods.vrhs > 0) {
			mods.empty += mods.vrhs;
			mods.empty += mods.vrmh;
			mods.vrhs = 0;
			mods.vrmh = 0;
		}
		if (mods.vrhs > 0 && mods.vrhs <= 3) {
			mods.empty += mods.vrhs;
			mods.vrhs = 0;
		}
		if (mods.vrmh > 0 && mods.vrmh <= 3) {
			mods.empty += mods.vrmh;
			mods.vrmh = 0;
		}
		(portalDetail.get(selectedPortal).team != fac) ? mods.empty = 4: false;
		(portalDetail.get(selectedPortal).team == fac) ? reqc = 6: reqc = 7;
		portalDetail.get(selectedPortal).resonators.forEach(function(reso) {
			(reso.level == 8) ? count++ : 0;
		})
		if (count >= reqc && oldpd != portalDetail.get(selectedPortal).title && (mods.empty >= 2 || portalDetail.get(selectedPortal).team == opp)) {
			var lat = window.portals[window.selectedPortal]._latlng.lat
			var lng = window.portals[window.selectedPortal]._latlng.lng
			dialog({
				html: '<center><b><a target="_blank" href="' + 'https://www.ingress.com/intel?ll=' + lat + ',' + lng + '&pll=' + lat + ',' + lng + '">' + portalDetail.get(selectedPortal).title + '</a></b> is eligible for Flash Fracking.</br></br>Usable slots: <b>' + mods.empty + ' | <a target="_blank" href="https://www.google.com/maps/dir/Current+Location/' + lat + ',' + lng + '">Google Maps</a></b></center>',
				dialogClass: 'ui-dialog-portalslist',
				title: 'ELIGIBLE PORTAL FOUND',
				id: 'portal-found'
			});
			oldpd = portalDetail.get(selectedPortal).title;
		}
	}
})