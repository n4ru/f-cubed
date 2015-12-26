// ==UserScript==
// @name         Flash Fracking Farm Finder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
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

// Your code here...

var oldpd = '';
var fac = ((window.PLAYER.team == 'ENLIGHTENED') ? 'enl' : 'res');
var opp = ((window.PLAYER.team == 'ENLIGHTENED') ? 'res' : 'enl');
$('body').on('DOMNodeInserted', function() {
    $('[id*=ui-id]').each(function() {
        if ($(this).text().indexOf("Portal list") > -1 && $('#filterlist').length == 0) {
            fac = $('#name').find('span').attr('class')
            opp = ($('#name').find('span').attr('class') == "enl" ? "res" : "enl")
            $(this).append("<span style='float:left'><a href='#' id='filterlist'>Filter 7+</a></span>")
            $('#filterlist').click(function() {
                $('td[style*="rgb"]').each(function() {
                    if ($(this).text() != "L8" && $(this).text() != "L7") {
                        $(this).parent().remove();
                    }
                })
            })
        }
    })
})

$('#portaldetails').on('DOMNodeInserted', function() {
    if ($('#portaldetails h3.title').text() != oldpd) {
        oldpd = '';
    }
    if ($('#portaldetails #resodetails tbody tr th').length == 8 && $('.mods').children().length == 4) {
        var count = 0;
        var mods = {
            'empty': 0,
            'vrhs': 0,
            'vrmh': 0,
            'rhs': 0
        }
        $('.mods').children().each(function() {
            switch ($(this).text()) {
                case "":
                    mods.empty++;
                    break;
                case "Very rare Heat Sink":
                    mods.vrhs++;
                    break;
                case "Rare Heat Sink":
                    mods.rhs++;
                    break;
                case "Very rare Multi-hack":
                    mods.vrmh++;
                    break;
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
        $('#portaldetails #resodetails tbody tr th .meter-level').each(function() {
            pd = $('#portaldetails h3.title').text();
            if (parseInt($(this).text().match(/[7-8]/), 10) == 8) {
                count++;
            }
            ($('#portaldetails').attr('class') == fac) ? reqc = 6: reqc = 7;
            ($('#portaldetails').attr('class') != fac) ? mods.empty = 4: 0;
            if (count >= reqc && oldpd != pd && (mods.empty >= 2 || $('#portaldetails').attr('class') == opp)) {
                var lat = window.portals[window.selectedPortal]._latlng.lat
                var lng = window.portals[window.selectedPortal]._latlng.lng
                $('.ui-button-text').each(function() {
                    if ($(this).text() == "OK")
                        $(this).parent().parent().parent().remove();
                })
                $('[href*="/intel"]').each(function() {
                    if ($(this).text() == pd || $(this).attr('title') == "Create a URL link to this portal") {
                        dialog({
                            html: '<b><a target="_blank" href="' + $(this).attr('href') + '">' + $('#portaldetails h3.title').text() + '</a></b> is eligible for Flash Fracking.</br></br><center>Usable slots: <b>' + mods.empty + ' | <a target="_blank" href="https://www.google.com/maps/dir/Current+Location/' + lat + ',' + lng + '">Google Maps</a></b></center>',
                            dialogClass: 'ui-dialog-portalslist',
                            title: 'ELIGIBLE PORTAL FOUND',
                            id: 'portal-found'
                        });
                        oldpd = pd;
                    }
                })
            }
        })
    }
})