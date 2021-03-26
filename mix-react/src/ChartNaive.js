import React, { useRef, useEffect } from "react";
import data from "./potions.json";
import * as d3 from "d3";

data.forEach((d) => {
  d["complexity"] = parseInt(d["complexity"]);
  d["brew_time_min"] = parseInt(d["brew_time_min"]);
});

export default function ChartNaive() {
  const ref = useRef();

  const width = window.screen.width * 0.3;
  const height = width * (3 / 4);
  const padding = 40;

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d["brew_time_min"]))
    .range([padding, width - padding])
    .nice();

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d["complexity"])])
    .range([height - padding, padding])
    .nice();

  useEffect(() => {
    const vis = d3.select(ref.current);

    const points = vis
      .selectAll("point")
      .data(data)
      .join("circle")
      .attr("r", 5)
      .attr("cx", (d) => x(d["brew_time_min"]))
      .attr("cy", (d) => y(d["complexity"]))
      .attr("fill", (d) => d.color);

    vis
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .call(d3.axisLeft(y));

    vis
      .append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(d3.axisBottom(x));

    const labels = vis.append("g").attr("id", "labels");

    points.on("mouseover", function (e, d) {
      const hoverPoint = d3
        .select(this)
        .raise()
        .call((point) =>
          point.transition().duration(800).attr("r", 8).style("stroke", "black")
        );
      labels
        .append("text")
        .text(d.potion)
        .attr("class", "text-xs")
        .style("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${hoverPoint.attr("cx")}, ${hoverPoint.attr("cy")})`
        )
        .attr("dy", -12);
    });

    points.on("mouseout", function (e) {
      labels.selectAll("text").remove();
      d3.select(this).call((point) =>
        point.transition().duration(800).attr("r", 5).style("stroke", "none")
      );
    });
  }, []);

  return (
    <svg
      width={width}
      height={height}
      className="m-auto border border-gray-300"
      ref={ref}
    ></svg>
  );
}
