'use strict';
/* global $ dayModule */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

var daysModule = (function () {

  // application state

  var days = [],
      currentDay;

  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo (newCurrentDay) {
    if (currentDay) currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
  }

  // jQuery event binding

  $(function () {
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });

  function addDay (e) {
    if (this && this.blur) this.blur(); // removes focus box from buttons

    var newDay = dayModule.create({ number: days.length + 1 });// dayModule
    days.push(newDay);// what we need to replace - make it persistent

    $.post('/api/days', {number: newDay.number})

    if (days.length === 1) {
      currentDay = newDay;
      switchTo(currentDay);
    }
  }


  function loadDays(){
    $.get('/api/days').then(function(dayArr){
      dayArr.forEach(function(e){
        var newDay = dayModule.create(e);
        days.push(newDay);
      if (days.length === 1) {
        currentDay = newDay;
        switchTo(currentDay);
    }
      })
    })
  }

  function deleteFromBackEnd (deleteDay) {
    $.ajax({
      url: '/api/day/' + deleteDay.number,
      type: 'DELETE',
      success: function () {
      },
      error: function () {
      }
    });
  }

  function deleteCurrentDay () {
    // prevent deleting last day
    if (days.length < 2 || !currentDay) return;
    // remove from the collection
    var index = days.indexOf(currentDay),
      previousDay = days.splice(index, 1)[0],
      newCurrent = days[index] || days[index - 1];
    // fix the remaining day numbers
    days.forEach(function (day, i) {
      day.setNumber(i + 1);
    });
    deleteFromBackEnd(previousDay);

    switchTo(newCurrent);
    previousDay.hideButton();
  }

  // globally accessible module methods

  var methods = {

    load: function () {
      $(loadDays);

    },

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      currentDay.addAttraction(attraction);
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return methods;

}());
