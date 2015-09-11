$(function() {

  if ($('body').hasClass('homerooms') && $('body').hasClass('show')) {

    // Initialize table sort on roster table
    var table = document.getElementById('roster-table');
    new Tablesort(table, { descending: false });

    // Initialize table sort on roster table
    $('#homeroom-select').bind('change', function() {
      window.location.pathname = '/homerooms/' + $(this).val();
    });

    function updateColumns () {
      columns_selected_inputs = $("#column-listing").find("input:checked");
      if (columns_selected_inputs.length > 6) {
        $('#select-limit-warning').addClass('on');
        this.checked = false;
        return false;
      } else {
        $('#select-limit-warning').removeClass('on');
        columns_selected = $.map(columns_selected_inputs, function(c) {
          return c.name;
        });
        for (var column in roster_columns) {
          if (columns_selected.indexOf(column) === -1) {
            $('.' + column).hide();
          } else {
            $('.' + column).show();
          }
        }
      }
    }

    function updateCookies () {
      Cookies.set("columns_selected", columns_selected);
    }

    // Show/hide column groups
    var roster_columns = {
        'name': 'Name',
        'risk': 'Risk',
        'program': 'Program',
        'sped': 'SPED & Disability',
        'language': 'Language',
        'free-reduced': 'Free/Reduced Lunch',
        'star_math': 'STAR Math',
        'star_reading': 'STAR Reading',
        'mcas_math': 'MCAS Math',
        'mcas_ela': 'MCAS ELA',
        'access': 'Access',
        'dibels': 'DIBELS',
        'interventions': 'Interventions'
        // 'attendance': 'Attendance',
        // 'discipline': 'Discipline',
    };

    var columns_selected = Cookies.getJSON("columns_selected");
    var columnTemplate = $("#column-template").remove();

    $.each(roster_columns, function(key, column){
      var newColumnTemplate = columnTemplate.clone(),
      isselected = columns_selected.indexOf(key) !== -1;
      newColumnTemplate
        .find("input")
          .attr("name", key)
          .attr("checked", isselected)
          .on("change", updateColumns)
          .on("change", updateCookies)
        .end()
        .find("label")
          .text(column)
        .end()
        .appendTo("#column-listing")
    });
    updateColumns();

    $('#column-picker-toggle').mouseover(function() {
      $('#column-picker').show();
    }).click(function() {
      $('#column-picker').toggle();
    });

    // Risk level tooltip for overall roster table
    var roster_rooltip_template = $('#roster-tooltip-template').html();
    var rendered = Mustache.render(roster_rooltip_template);

    $('#roster-tooltip').tooltipster({
      content: rendered,
      position: 'bottom-right',
      contentAsHTML: true
    });

    // Tooltips for individual student risk levels

    function getRiskLevelToolTip (studentId) {
      var tooltip = $(".risk-level-tooltip[data-student-id='" + studentId + "']").html();
      var mustache_rendered = Mustache.render(tooltip);
      return mustache_rendered;
    }

    $.each($('.risk-tooltip-circle'), function() {
      $this = $(this)
      var student_id = parseInt($this.data('student-id'))
      var tooltip = getRiskLevelToolTip(student_id)
      $this.tooltipster({
        content: tooltip,
        position: 'bottom',
        contentAsHTML: true
      });
    });

    // Turn table rows into links to student profiles
    $('tbody td').click(function () {
      location.href = $(this).attr('href');
    });


    // Bulk intervention assignment
    $('#add-interventions-row').dialog({
      autoOpen: false
    });

    $('#assign-bulk-interventions').click(function() {
      $('#add-interventions-row').dialog('open');
    });

    var chartData = $('#chart-data');
    RosterChart.fromChartData(chartData).render();

  }

});
