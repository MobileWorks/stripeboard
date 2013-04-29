$(document).ready(function (){
  var render, key, value;
  render = function (json) {
    // no data, try again in 5 seconds...
    if (json.paying_customers == 0) {
      return setTimeout(function() {
        $.getJSON(jsonUrl, render);
      }, 5000);
    };

    // replace on page variables
    for (key in json) {
      value = json[key];
      $('span[data-value-key="'+key+'"]').text(value);
    }

    // build data for graph
    var revenue = [];
    var customers = [];
    for (var i = 0; i < json.periods.length; i++) {
      period = json.periods[i];
      revenue.push({x: period.timestamp, y: period.monthly_revenue});
      customers.push({x: period.timestamp, y: period.customers});
    };

    // build graph
    var customer_graph = new Rickshaw.Graph({
      element: document.querySelector('#customer-chart'),
      width: 600,
      height: 575,
      renderer: 'line',
      series: [{
          name: 'Customers',
          color: 'slategrey',
          data: customers
      }]
    });


    // build graph
    var revenue_graph = new Rickshaw.Graph({
      element: document.querySelector('#revenue-chart'),
      width: 600,
      height: 575,
      renderer: 'line',
      series: [{
          name: 'Monthly Revenue',
          color: 'steelblue',
          data: revenue
        }]
    });

    customer_graph.render();
    revenue_graph.render();
    
    var hoverDetail_customer = new Rickshaw.Graph.HoverDetail({
      graph:customer_graph,
    });

    var hoverDetail_revenue = new Rickshaw.Graph.HoverDetail({
      graph:revenue_graph,
    });
    
    var xAxis_customer = new Rickshaw.Graph.Axis.Time({
        graph:customer_graph,
    });

    
    var xAxis_revenue = new Rickshaw.Graph.Axis.Time({
        graph:revenue_graph,
    });
    
    var yAxis_customer = new Rickshaw.Graph.Axis.Y({
        graph:customer_graph,
    });

    var yAxis_revenue = new Rickshaw.Graph.Axis.Y({
        graph:revenue_graph,
    });
    
    xAxis_customer.render();
    yAxis_customer.render();

    xAxis_revenue.render();
    yAxis_revenue.render();

  };
  $.getJSON(jsonUrl, render);
});
