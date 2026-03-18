import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, CartesianGrid, Legend, ReferenceLine } from "recharts";

const DATA = [{"t":"Arsenal","cp":70,"gp":31,"gf":61,"ga":22,"gr":7,"pp":85.5,"ps":2.9,"p5":80.0,"p95":89.0,"gd":47.8,"ch":99.5,"t4":100.0,"t6":100.0,"rel":0.0,"pos":1,"mp":1,"ar":1.855,"dr":0.553,"or":3.354,"bt":15.8,"pd":{"1":99.5,"2":0.5,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":0.0,"9":0.0,"10":0.0,"11":0.0,"12":0.0,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":21,"d":7,"l":3},{"t":"Man City","cp":61,"gp":30,"gf":60,"ga":28,"gr":7,"pp":73.6,"ps":3.2,"p5":68.0,"p95":79.0,"gd":36.1,"ch":0.5,"t4":99.9,"t6":100.0,"rel":0.0,"pos":2,"mp":2,"ar":1.477,"dr":0.696,"or":2.122,"bt":10.6,"pd":{"1":0.5,"2":87.6,"3":11.1,"4":0.7,"5":0.1,"6":0.0,"7":0.0,"8":0.0,"9":0.0,"10":0.0,"11":0.0,"12":0.0,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":18,"d":7,"l":5},{"t":"Man United","cp":54,"gp":30,"gf":54,"ga":41,"gr":8,"pp":68.4,"ps":3.5,"p5":63.0,"p95":74.0,"gd":17.5,"ch":0.0,"t4":94.6,"t6":99.8,"rel":0.0,"pos":3,"mp":3,"ar":1.544,"dr":0.907,"or":1.702,"bt":10.1,"pd":{"1":0.0,"2":11.1,"3":70.3,"4":13.1,"5":3.9,"6":1.3,"7":0.2,"8":0.0,"9":0.0,"10":0.0,"11":0.0,"12":0.0,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":15,"d":9,"l":6},{"t":"Aston Villa","cp":51,"gp":30,"gf":40,"ga":37,"gr":8,"pp":61.7,"ps":3.5,"p5":56.0,"p95":68.0,"gd":2.7,"ch":0.0,"t4":34.9,"t6":85.6,"rel":0.0,"pos":4,"mp":5,"ar":0.86,"dr":1.108,"or":0.776,"bt":4.39,"pd":{"1":0.0,"2":0.3,"3":4.9,"4":29.7,"5":29.0,"6":21.6,"7":9.1,"8":3.4,"9":1.3,"10":0.5,"11":0.1,"12":0.0,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":15,"d":6,"l":9},{"t":"Liverpool","cp":49,"gp":30,"gf":49,"ga":40,"gr":8,"pp":61.0,"ps":3.6,"p5":55.0,"p95":67.0,"gd":10.7,"ch":0.0,"t4":34.3,"t6":81.7,"rel":0.0,"pos":5,"mp":5,"ar":1.381,"dr":1.018,"or":1.357,"bt":5.19,"pd":{"1":0.0,"2":0.2,"3":6.7,"4":27.5,"5":25.4,"6":22.0,"7":10.4,"8":4.5,"9":2.2,"10":0.9,"11":0.2,"12":0.1,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":14,"d":7,"l":9},{"t":"Chelsea","cp":48,"gp":30,"gf":53,"ga":35,"gr":8,"pp":60.7,"ps":3.5,"p5":55.0,"p95":67.0,"gd":20.6,"ch":0.0,"t4":31.8,"t6":83.2,"rel":0.0,"pos":6,"mp":5,"ar":1.477,"dr":0.965,"or":1.531,"bt":5.31,"pd":{"1":0.0,"2":0.3,"3":6.7,"4":24.8,"5":28.4,"6":23.0,"7":10.1,"8":4.2,"9":1.5,"10":0.6,"11":0.2,"12":0.1,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":13,"d":9,"l":8},{"t":"Brentford","cp":45,"gp":30,"gf":46,"ga":42,"gr":8,"pp":55.7,"ps":3.5,"p5":50.0,"p95":62.0,"gd":3.6,"ch":0.0,"t4":2.8,"t6":24.1,"rel":0.0,"pos":7,"mp":8,"ar":1.208,"dr":1.142,"or":1.058,"bt":5.26,"pd":{"1":0.0,"2":0.0,"3":0.3,"4":2.5,"5":7.1,"6":14.2,"7":24.7,"8":18.6,"9":13.8,"10":8.8,"11":5.4,"12":2.8,"13":1.3,"14":0.5,"15":0.0,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":13,"d":6,"l":11},{"t":"Everton","cp":43,"gp":30,"gf":34,"ga":35,"gr":8,"pp":53.9,"ps":3.5,"p5":48.0,"p95":60.0,"gd":-0.9,"ch":0.0,"t4":1.1,"t6":11.0,"rel":0.0,"pos":8,"mp":9,"ar":0.876,"dr":0.862,"or":1.017,"bt":4.68,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":1.1,"5":3.0,"6":6.8,"7":14.3,"8":17.8,"9":17.2,"10":14.6,"11":10.8,"12":7.7,"13":4.3,"14":1.9,"15":0.3,"16":0.0,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":12,"d":7,"l":11},{"t":"Newcastle","cp":42,"gp":30,"gf":43,"ga":43,"gr":8,"pp":52.6,"ps":3.5,"p5":47.0,"p95":58.0,"gd":-0.6,"ch":0.0,"t4":0.2,"t6":5.2,"rel":0.0,"pos":9,"mp":10,"ar":1.165,"dr":1.25,"or":0.932,"bt":4.59,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.2,"5":1.1,"6":3.9,"7":11.1,"8":14.7,"9":16.7,"10":15.5,"11":13.4,"12":10.7,"13":7.9,"14":4.0,"15":0.8,"16":0.1,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":12,"d":6,"l":12},{"t":"Brighton","cp":40,"gp":30,"gf":39,"ga":36,"gr":8,"pp":51.6,"ps":3.5,"p5":46.0,"p95":57.0,"gd":4.0,"ch":0.0,"t4":0.1,"t6":4.0,"rel":0.0,"pos":10,"mp":10,"ar":0.793,"dr":0.719,"or":1.103,"bt":4.34,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.1,"5":0.9,"6":2.9,"7":7.8,"8":13.4,"9":14.9,"10":16.5,"11":15.6,"12":13.2,"13":9.3,"14":4.2,"15":1.1,"16":0.1,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":10,"d":10,"l":10},{"t":"Bournemouth","cp":41,"gp":30,"gf":44,"ga":46,"gr":8,"pp":51.2,"ps":3.4,"p5":46.0,"p95":57.0,"gd":-2.9,"ch":0.0,"t4":0.0,"t6":2.2,"rel":0.0,"pos":11,"mp":11,"ar":0.952,"dr":0.884,"or":1.077,"bt":4.94,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.4,"6":1.8,"7":5.2,"8":10.1,"9":12.9,"10":15.4,"11":17.2,"12":15.5,"13":11.8,"14":7.4,"15":2.0,"16":0.1,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":9,"d":14,"l":7},{"t":"Fulham","cp":41,"gp":30,"gf":40,"ga":43,"gr":8,"pp":50.9,"ps":3.4,"p5":45.0,"p95":57.0,"gd":-4.5,"ch":0.0,"t4":0.1,"t6":2.5,"rel":0.0,"pos":12,"mp":11,"ar":0.944,"dr":1.109,"or":0.852,"bt":3.74,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.1,"5":0.5,"6":1.9,"7":4.8,"8":8.4,"9":11.1,"10":14.0,"11":16.5,"12":17.2,"13":15.5,"14":8.1,"15":1.8,"16":0.2,"17":0.0,"18":0.0,"19":0.0,"20":0.0},"w":12,"d":5,"l":13},{"t":"Sunderland","cp":40,"gp":30,"gf":30,"ga":35,"gr":8,"pp":49.0,"ps":3.3,"p5":44.0,"p95":55.0,"gd":-7.0,"ch":0.0,"t4":0.0,"t6":0.5,"rel":0.0,"pos":13,"mp":12,"ar":0.632,"dr":0.969,"or":0.652,"bt":3.12,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.1,"6":0.3,"7":1.8,"8":3.7,"9":6.2,"10":8.7,"11":12.7,"12":18.1,"13":23.3,"14":18.6,"15":5.4,"16":1.1,"17":0.1,"18":0.0,"19":0.0,"20":0.0},"w":10,"d":10,"l":10},{"t":"Crystal Palace","cp":39,"gp":30,"gf":33,"ga":35,"gr":7,"pp":46.5,"ps":3.1,"p5":42.0,"p95":52.0,"gd":-4.3,"ch":0.0,"t4":0.0,"t6":0.1,"rel":0.0,"pos":14,"mp":14,"ar":0.806,"dr":0.962,"or":0.838,"bt":3.12,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.0,"6":0.1,"7":0.5,"8":1.1,"9":2.2,"10":4.3,"11":7.1,"12":11.9,"13":20.2,"14":35.0,"15":14.1,"16":3.0,"17":0.5,"18":0.0,"19":0.0,"20":0.0},"w":10,"d":9,"l":11},{"t":"Leeds","cp":32,"gp":30,"gf":37,"ga":48,"gr":8,"pp":42.0,"ps":3.4,"p5":37.0,"p95":48.0,"gd":-11.9,"ch":0.0,"t4":0.0,"t6":0.0,"rel":6.3,"pos":15,"mp":15,"ar":0.833,"dr":1.077,"or":0.774,"bt":3.06,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":0.1,"9":0.1,"10":0.3,"11":0.7,"12":2.1,"13":4.6,"14":12.3,"15":38.5,"16":22.7,"17":12.4,"18":6.2,"19":0.0,"20":0.0},"w":7,"d":11,"l":12},{"t":"West Ham","cp":29,"gp":30,"gf":36,"ga":55,"gr":8,"pp":38.7,"ps":3.5,"p5":33.0,"p95":44.0,"gd":-20.7,"ch":0.0,"t4":0.0,"t6":0.0,"rel":30.1,"pos":16,"mp":17,"ar":1.012,"dr":1.194,"or":0.848,"bt":3.43,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":0.0,"9":0.0,"10":0.0,"11":0.1,"12":0.2,"13":0.7,"14":3.1,"15":12.5,"16":23.3,"17":30.0,"18":29.1,"19":1.0,"20":0.0},"w":7,"d":8,"l":15},{"t":"Nott'm Forest","cp":29,"gp":30,"gf":28,"ga":43,"gr":8,"pp":38.4,"ps":3.3,"p5":33.0,"p95":44.0,"gd":-16.6,"ch":0.0,"t4":0.0,"t6":0.0,"rel":30.9,"pos":17,"mp":17,"ar":0.672,"dr":0.936,"or":0.718,"bt":2.5,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":0.0,"9":0.0,"10":0.0,"11":0.0,"12":0.2,"13":0.5,"14":2.4,"15":11.5,"16":25.8,"17":28.7,"18":30.1,"19":0.8,"20":0.0},"w":7,"d":8,"l":15},{"t":"Tottenham","cp":30,"gp":30,"gf":40,"ga":47,"gr":8,"pp":37.9,"ps":3.3,"p5":33.0,"p95":43.0,"gd":-10.8,"ch":0.0,"t4":0.0,"t6":0.0,"rel":33.0,"pos":18,"mp":17,"ar":0.88,"dr":1.565,"or":0.562,"bt":1.68,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":0.0,"9":0.0,"10":0.0,"11":0.1,"12":0.2,"13":0.5,"14":2.6,"15":12.1,"16":23.7,"17":27.9,"18":32.5,"19":0.5,"20":0.0},"w":7,"d":9,"l":14},{"t":"Burnley","cp":20,"gp":30,"gf":32,"ga":58,"gr":8,"pp":26.6,"ps":3.1,"p5":22.0,"p95":32.0,"gd":-32.4,"ch":0.0,"t4":0.0,"t6":0.0,"rel":99.8,"pos":19,"mp":19,"ar":0.801,"dr":1.615,"or":0.496,"bt":1.66,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":0.0,"9":0.0,"10":0.0,"11":0.0,"12":0.0,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.2,"18":1.1,"19":51.2,"20":47.4},"w":4,"d":8,"l":18},{"t":"Wolves","cp":17,"gp":31,"gf":24,"ga":54,"gr":7,"pp":26.0,"ps":3.2,"p5":21.0,"p95":31.0,"gd":-30.4,"ch":0.0,"t4":0.0,"t6":0.0,"rel":99.8,"pos":20,"mp":20,"ar":0.753,"dr":1.07,"or":0.703,"bt":2.48,"pd":{"1":0.0,"2":0.0,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":0.0,"9":0.0,"10":0.0,"11":0.0,"12":0.0,"13":0.0,"14":0.0,"15":0.0,"16":0.0,"17":0.2,"18":0.9,"19":46.4,"20":52.5},"w":3,"d":8,"l":20}];

const FIXTURES = [{"h":"Bournemouth","a":"Man United","hx":0.98,"ax":1.36,"ph":24.6,"pd":31.9,"pa":43.5},{"h":"Brighton","a":"Liverpool","hx":0.91,"ax":0.99,"ph":29.6,"pd":36.5,"pa":33.9},{"h":"Fulham","a":"Burnley","hx":1.72,"ax":0.89,"ph":55.1,"pd":27.7,"pa":17.2},{"h":"Everton","a":"Chelsea","hx":0.96,"ax":1.27,"ph":25.6,"pd":33.0,"pa":41.4},{"h":"Leeds","a":"Brentford","hx":1.08,"ax":1.3,"ph":28.4,"pd":32.2,"pa":39.4},{"h":"Newcastle","a":"Sunderland","hx":1.28,"ax":0.79,"ph":45.6,"pd":33.5,"pa":20.8},{"h":"Aston Villa","a":"West Ham","hx":1.16,"ax":1.12,"ph":34.4,"pd":33.2,"pa":32.4},{"h":"Tottenham","a":"Nott'm Forest","hx":0.93,"ax":1.05,"ph":29.0,"pd":35.7,"pa":35.3},{"h":"West Ham","a":"Wolves","hx":1.22,"ax":0.9,"ph":41.4,"pd":33.9,"pa":24.8},{"h":"Arsenal","a":"Bournemouth","hx":1.85,"ax":0.53,"ph":67.9,"pd":23.9,"pa":8.2},{"h":"Brentford","a":"Everton","hx":1.18,"ax":1.0,"ph":37.5,"pd":33.9,"pa":28.6},{"h":"Burnley","a":"Brighton","hx":0.65,"ax":1.28,"ph":16.8,"pd":33.6,"pa":49.6},{"h":"Crystal Palace","a":"Newcastle","hx":1.14,"ax":1.12,"ph":33.8,"pd":33.4,"pa":32.9},{"h":"Nott'm Forest","a":"Aston Villa","hx":0.84,"ax":0.8,"ph":31.4,"pd":39.3,"pa":29.3},{"h":"Liverpool","a":"Fulham","hx":1.73,"ax":0.96,"ph":53.5,"pd":27.7,"pa":18.8},{"h":"Sunderland","a":"Tottenham","hx":1.12,"ax":0.85,"ph":39.3,"pd":35.4,"pa":25.3},{"h":"Chelsea","a":"Man City","hx":1.16,"ax":1.43,"ph":28.5,"pd":30.6,"pa":40.9},{"h":"Man United","a":"Leeds","hx":1.88,"ax":0.76,"ph":62.2,"pd":25.2,"pa":12.6},{"h":"Brentford","a":"Fulham","hx":1.51,"ax":1.08,"ph":45.1,"pd":30.0,"pa":24.9},{"h":"Aston Villa","a":"Sunderland","hx":0.94,"ax":0.7,"ph":37.4,"pd":38.9,"pa":23.7},{"h":"Leeds","a":"Wolves","hx":1.01,"ax":0.81,"ph":36.8,"pd":37.1,"pa":26.1},{"h":"Newcastle","a":"Bournemouth","hx":1.16,"ax":1.19,"ph":33.1,"pd":32.6,"pa":34.3},{"h":"Nott'm Forest","a":"Burnley","hx":1.23,"ax":0.75,"ph":45.2,"pd":34.3,"pa":20.4},{"h":"Tottenham","a":"Brighton","hx":0.71,"ax":1.24,"ph":19.2,"pd":34.2,"pa":46.6},{"h":"Chelsea","a":"Man United","hx":1.51,"ax":1.49,"ph":36.4,"pd":28.2,"pa":35.3},{"h":"Everton","a":"Liverpool","hx":1.01,"ax":1.19,"ph":28.6,"pd":33.7,"pa":37.7},{"h":"Man City","a":"Arsenal","hx":0.92,"ax":1.29,"ph":24.3,"pd":33.0,"pa":42.7},{"h":"Crystal Palace","a":"West Ham","hx":1.09,"ax":0.97,"ph":35.5,"pd":35.0,"pa":29.6},{"h":"Sunderland","a":"Nott'm Forest","hx":0.67,"ax":0.65,"ph":28.6,"pd":43.8,"pa":27.6},{"h":"Fulham","a":"Aston Villa","hx":1.18,"ax":0.95,"ph":38.8,"pd":34.1,"pa":27.1},{"h":"Bournemouth","a":"Leeds","hx":1.16,"ax":0.74,"ph":43.5,"pd":35.4,"pa":21.1},{"h":"Liverpool","a":"Crystal Palace","hx":1.5,"ax":0.82,"ph":51.2,"pd":30.4,"pa":18.4},{"h":"West Ham","a":"Everton","hx":0.99,"ax":1.05,"ph":30.8,"pd":35.3,"pa":33.9},{"h":"Wolves","a":"Tottenham","hx":1.33,"ax":0.94,"ph":43.4,"pd":32.4,"pa":24.2},{"h":"Arsenal","a":"Newcastle","hx":2.62,"ax":0.64,"ph":78.3,"pd":15.9,"pa":5.7},{"h":"Burnley","a":"Man City","hx":0.63,"ax":2.39,"ph":6.7,"pd":18.2,"pa":75.1},{"h":"Brighton","a":"Chelsea","hx":0.87,"ax":1.06,"ph":26.8,"pd":36.1,"pa":37.2},{"h":"Man United","a":"Brentford","hx":1.99,"ax":1.1,"ph":56.4,"pd":25.0,"pa":18.7},{"h":"Bournemouth","a":"Crystal Palace","hx":1.04,"ax":0.71,"ph":40.2,"pd":37.4,"pa":22.4},{"h":"Arsenal","a":"Fulham","hx":2.32,"ax":0.52,"ph":76.7,"pd":17.8,"pa":5.4},{"h":"Aston Villa","a":"Tottenham","hx":1.52,"ax":0.97,"ph":47.8,"pd":30.1,"pa":22.1},{"h":"Brentford","a":"West Ham","hx":1.63,"ax":1.16,"ph":46.4,"pd":28.7,"pa":25.0},{"h":"Chelsea","a":"Nott'm Forest","hx":1.56,"ax":0.65,"ph":57.5,"pd":29.1,"pa":13.4},{"h":"Everton","a":"Man City","hx":0.69,"ax":1.27,"ph":18.0,"pd":33.7,"pa":48.3},{"h":"Leeds","a":"Burnley","hx":1.52,"ax":0.86,"ph":50.6,"pd":30.2,"pa":19.2},{"h":"Man United","a":"Liverpool","hx":1.78,"ax":1.25,"ph":47.8,"pd":27.1,"pa":25.1},{"h":"Newcastle","a":"Brighton","hx":0.95,"ax":0.99,"ph":30.7,"pd":36.2,"pa":33.1},{"h":"Wolves","a":"Sunderland","hx":0.82,"ax":0.68,"ph":33.9,"pd":40.9,"pa":25.2},{"h":"Brighton","a":"Wolves","hx":0.96,"ax":0.54,"ph":42.4,"pd":39.5,"pa":18.1},{"h":"Burnley","a":"Aston Villa","hx":1.0,"ax":1.39,"ph":24.9,"pd":31.6,"pa":43.5},{"h":"Crystal Palace","a":"Everton","hx":0.79,"ax":0.84,"ph":28.6,"pd":39.5,"pa":31.9},{"h":"Fulham","a":"Bournemouth","hx":0.94,"ax":1.06,"ph":29.3,"pd":35.5,"pa":35.2},{"h":"Liverpool","a":"Chelsea","hx":1.51,"ax":1.5,"ph":36.0,"pd":28.2,"pa":35.8},{"h":"Man City","a":"Brentford","hx":1.91,"ax":0.84,"ph":60.6,"pd":25.3,"pa":14.1},{"h":"Nott'm Forest","a":"Newcastle","hx":0.95,"ax":1.09,"ph":28.8,"pd":35.1,"pa":36.1},{"h":"Sunderland","a":"Man United","hx":0.65,"ax":1.5,"ph":14.1,"pd":30.1,"pa":55.8},{"h":"Tottenham","a":"Leeds","hx":1.07,"ax":1.3,"ph":28.2,"pd":32.2,"pa":39.6},{"h":"West Ham","a":"Arsenal","hx":0.63,"ax":2.21,"ph":7.7,"pd":20.2,"pa":72.1},{"h":"Bournemouth","a":"Man City","hx":0.75,"ax":1.31,"ph":19.2,"pd":33.2,"pa":47.6},{"h":"Arsenal","a":"Burnley","hx":3.39,"ax":0.44,"ph":90.0,"pd":8.2,"pa":1.7},{"h":"Aston Villa","a":"Liverpool","hx":0.99,"ax":1.53,"ph":22.3,"pd":30.0,"pa":47.7},{"h":"Brentford","a":"Crystal Palace","hx":1.31,"ax":0.92,"ph":43.4,"pd":32.7,"pa":23.9},{"h":"Chelsea","a":"Tottenham","hx":2.61,"ax":0.85,"ph":73.8,"pd":17.6,"pa":8.7},{"h":"Everton","a":"Sunderland","hx":0.96,"ax":0.54,"ph":42.3,"pd":39.5,"pa":18.2},{"h":"Leeds","a":"Brighton","hx":0.68,"ax":0.85,"ph":24.6,"pd":40.5,"pa":34.9},{"h":"Man United","a":"Nott'm Forest","hx":1.63,"ax":0.61,"ph":60.4,"pd":27.9,"pa":11.7},{"h":"Newcastle","a":"West Ham","hx":1.57,"ax":1.27,"ph":42.4,"pd":28.9,"pa":28.7},{"h":"Wolves","a":"Fulham","hx":0.94,"ax":1.01,"ph":30.2,"pd":36.0,"pa":33.8},{"h":"Brighton","a":"Man United","hx":0.81,"ax":1.11,"ph":24.3,"pd":35.8,"pa":40.0},{"h":"Burnley","a":"Wolves","hx":0.97,"ax":1.22,"ph":27.0,"pd":33.6,"pa":39.4},{"h":"Crystal Palace","a":"Arsenal","hx":0.5,"ax":1.78,"ph":8.2,"pd":24.8,"pa":67.0},{"h":"Fulham","a":"Newcastle","hx":1.33,"ax":1.29,"ph":35.7,"pd":30.6,"pa":33.7},{"h":"Liverpool","a":"Brentford","hx":1.78,"ax":1.23,"ph":48.4,"pd":27.1,"pa":24.5},{"h":"Man City","a":"Aston Villa","hx":1.85,"ax":0.6,"ph":65.8,"pd":24.6,"pa":9.6},{"h":"Nott'm Forest","a":"Bournemouth","hx":0.67,"ax":0.89,"ph":23.7,"pd":39.9,"pa":36.3},{"h":"Sunderland","a":"Chelsea","hx":0.69,"ax":1.43,"ph":15.9,"pd":31.3,"pa":52.8},{"h":"Tottenham","a":"Everton","hx":0.86,"ax":1.37,"ph":21.2,"pd":32.1,"pa":46.7},{"h":"West Ham","a":"Leeds","hx":1.23,"ax":1.0,"ph":39.3,"pd":33.3,"pa":27.4}];

const COLORS = {
  champion: '#FFD700', top4: '#22c55e', top6: '#3b82f6', mid: '#94a3b8',
  danger: '#f97316', relegated: '#ef4444', bg: '#0f172a', card: '#1e293b',
  cardHover: '#334155', text: '#f1f5f9', textMuted: '#94a3b8',
  accent: '#818cf8', border: '#334155'
};

const TEAM_COLORS = {
  'Arsenal': '#EF0107', 'Man City': '#6CABDD', 'Man United': '#DA291C',
  'Aston Villa': '#670E36', 'Liverpool': '#C8102E', 'Chelsea': '#034694',
  'Brentford': '#e30613', 'Newcastle': '#241F20', 'Everton': '#003399',
  'Fulham': '#CC0000', 'Brighton': '#0057B8', 'Bournemouth': '#DA291C',
  'Sunderland': '#EB172B', 'Crystal Palace': '#1B458F', 'Leeds': '#FFCD00',
  'Tottenham': '#132257', "Nott'm Forest": '#DD0000', 'West Ham': '#7A263A',
  'Burnley': '#6C1D45', 'Wolves': '#FDB913'
};

const getZoneColor = (team) => {
  const d = DATA.find(x => x.t === team);
  if (!d) return COLORS.mid;
  if (d.ch > 30) return COLORS.champion;
  if (d.t4 > 50) return COLORS.top4;
  if (d.t6 > 50) return COLORS.top6;
  if (d.rel > 30) return COLORS.relegated;
  if (d.rel > 5) return COLORS.danger;
  return COLORS.mid;
};

const ProbBar = ({ value, color, max = 100, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 120, height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
    </div>
    <span style={{ fontSize: 11, color: COLORS.textMuted, minWidth: 40 }}>{value.toFixed(1)}%</span>
  </div>
);

const RadarChart = ({ team }) => {
  const d = DATA.find(x => x.t === team);
  if (!d) return null;
  const metrics = [
    { label: 'Attack', value: d.ar, max: 1.6 },
    { label: 'Defense', value: 2 - d.dr, max: 1.6 },
    { label: 'Points/G', value: d.cp / d.gp, max: 2.5 },
    { label: 'Goals/G', value: d.gf / d.gp, max: 2.2 },
    { label: 'BT Str', value: d.bt / 2, max: 8 },
  ];
  const cx = 80, cy = 80, r = 55;
  const points = metrics.map((m, i) => {
    const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
    const ratio = Math.min(m.value / m.max, 1);
    return { x: cx + Math.cos(angle) * r * ratio, y: cy + Math.sin(angle) * r * ratio, lx: cx + Math.cos(angle) * (r + 16), ly: cy + Math.sin(angle) * (r + 16), label: m.label };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const gridLevels = [0.25, 0.5, 0.75, 1];
  return (
    <svg viewBox="0 0 160 160" style={{ width: '100%', maxWidth: 200 }}>
      {gridLevels.map(level => {
        const gp = metrics.map((_, i) => {
          const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
          return `${cx + Math.cos(angle) * r * level},${cy + Math.sin(angle) * r * level}`;
        });
        return <polygon key={level} points={gp.join(' ')} fill="none" stroke="#334155" strokeWidth={0.5} />;
      })}
      {metrics.map((_, i) => {
        const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle) * r} y2={cy + Math.sin(angle) * r} stroke="#334155" strokeWidth={0.5} />;
      })}
      <path d={path} fill={`${TEAM_COLORS[team] || '#818cf8'}40`} stroke={TEAM_COLORS[team] || '#818cf8'} strokeWidth={1.5} />
      {points.map((p, i) => (
        <text key={i} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fill={COLORS.textMuted} fontSize={7}>{p.label}</text>
      ))}
    </svg>
  );
};

const PositionDistChart = ({ team }) => {
  const d = DATA.find(x => x.t === team);
  if (!d) return null;
  const distData = Object.entries(d.pd).map(([pos, pct]) => ({ pos: parseInt(pos), pct })).filter(x => x.pct > 0);
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={distData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <XAxis dataKey="pos" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Probability']} labelFormatter={(l) => `Position ${l}`} />
        <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
          {distData.map((entry) => (
            <Cell key={entry.pos} fill={entry.pos <= 4 ? COLORS.top4 : entry.pos >= 18 ? COLORS.relegated : COLORS.accent} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const tabs = [
  { id: 'standings', label: 'Predicted Standings', icon: '📊' },
  { id: 'montecarlo', label: 'Monte Carlo', icon: '🎲' },
  { id: 'teams', label: 'Team Profiles', icon: '⚽' },
  { id: 'fixtures', label: 'Fixture Analysis', icon: '📅' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('standings');
  const [selectedTeam, setSelectedTeam] = useState('Arsenal');
  const [sortBy, setSortBy] = useState('pos');

  const sortedData = useMemo(() => {
    const d = [...DATA];
    if (sortBy === 'pos') d.sort((a, b) => a.pos - b.pos);
    else if (sortBy === 'ch') d.sort((a, b) => b.ch - a.ch);
    else if (sortBy === 'rel') d.sort((a, b) => b.rel - a.rel);
    else if (sortBy === 'ar') d.sort((a, b) => b.ar - a.ar);
    return d;
  }, [sortBy]);

  const scatterData = useMemo(() => DATA.map(d => ({
    name: d.t, attack: d.ar, defense: (2 - d.dr).toFixed(3), pts: d.pp,
    fill: getZoneColor(d.t)
  })), []);

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.text, fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #0c0a09 100%)', borderBottom: `1px solid ${COLORS.border}`, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #e2e8f0, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EPL 2025-26 Predictions
            </h1>
            <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 400 }}>Dixon-Coles + Bradley-Terry Ensemble · 10K MC · 301 matches · Beats Bet365 (51.2% vs 49.5%)</span>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: COLORS.textMuted }}>
            Updated: March 17, 2026 · GW31 · {DATA[0].gr}-{DATA[1].gr} games remaining per team
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '14px 20px', border: 'none', background: activeTab === tab.id ? COLORS.bg : 'transparent',
              color: activeTab === tab.id ? COLORS.accent : COLORS.textMuted, cursor: 'pointer',
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, fontFamily: 'Inter, sans-serif',
              borderBottom: activeTab === tab.id ? `2px solid ${COLORS.accent}` : '2px solid transparent',
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        
        {/* ═══ STANDINGS TAB ═══ */}
        {activeTab === 'standings' && (
          <div>
            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Likely Champion', value: DATA[0].t, sub: `${DATA[0].ch}% probability`, color: COLORS.champion },
                { label: 'Top 4 Race', value: `${DATA.filter(d => d.t4 > 20).length} teams`, sub: DATA.filter(d => d.t4 > 20 && d.t4 < 100).map(d => d.t).join(', '), color: COLORS.top4 },
                { label: 'Relegated (>90%)', value: DATA.filter(d => d.rel > 90).map(d => d.t).join(', ') || 'None locked', sub: `${DATA.filter(d => d.rel > 50).length} teams in danger`, color: COLORS.relegated },
                { label: 'Model', value: 'Ensemble', sub: '65% Poisson + 35% BT', color: COLORS.accent },
              ].map((stat, i) => (
                <div key={i} style={{ background: COLORS.card, borderRadius: 10, padding: '16px 18px', border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>{stat.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: stat.color, fontFamily: 'Inter, sans-serif' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Main table */}
            <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'auto' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14 }}>Predicted Final Standings</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[{k:'pos',l:'By Position'},{k:'ch',l:'By Title%'},{k:'rel',l:'By Releg%'},{k:'ar',l:'By Attack'}].map(s => (
                    <button key={s.k} onClick={() => setSortBy(s.k)} style={{
                      padding: '4px 10px', fontSize: 11, borderRadius: 6, border: `1px solid ${sortBy === s.k ? COLORS.accent : COLORS.border}`,
                      background: sortBy === s.k ? `${COLORS.accent}20` : 'transparent', color: sortBy === s.k ? COLORS.accent : COLORS.textMuted, cursor: 'pointer'
                    }}>{s.l}</button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 800 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      {['#', 'Team', 'GP', 'Pts', 'GD', 'Pred Pts', '90% CI', 'Title%', 'Top 4%', 'Releg%'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Team' ? 'left' : 'right', color: COLORS.textMuted, fontWeight: 500, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Inter, sans-serif' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((d, idx) => {
                      const zone = d.pos <= 4 ? 'top4' : d.pos >= 18 ? 'rel' : d.pos <= 6 ? 'top6' : '';
                      return (
                        <tr key={d.t} onClick={() => { setSelectedTeam(d.t); setActiveTab('teams'); }} style={{
                          borderBottom: `1px solid ${COLORS.border}`, cursor: 'pointer',
                          background: zone === 'top4' ? '#22c55e08' : zone === 'rel' ? '#ef444408' : 'transparent',
                          borderLeft: `3px solid ${zone === 'top4' ? COLORS.top4 : zone === 'rel' ? COLORS.relegated : zone === 'top6' ? COLORS.top6 : 'transparent'}`
                        }}>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: COLORS.textMuted }}>{d.pos}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: TEAM_COLORS[d.t] || '#888', marginRight: 8, verticalAlign: 'middle' }} />
                            {d.t}
                            {d.ch > 50 && <span style={{ marginLeft: 6, fontSize: 10, color: COLORS.champion }}>👑</span>}
                            {d.rel > 90 && <span style={{ marginLeft: 6, fontSize: 10 }}>⬇️</span>}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', color: COLORS.textMuted }}>{d.gp}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{d.cp}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', color: d.gf - d.ga > 0 ? COLORS.top4 : COLORS.relegated }}>{d.gf - d.ga > 0 ? '+' : ''}{d.gf - d.ga}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontSize: 14, color: COLORS.accent }}>{d.pp}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', color: COLORS.textMuted, fontSize: 11 }}>{d.p5}–{d.p95}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            {d.ch > 0 ? <ProbBar value={d.ch} color={COLORS.champion} /> : <span style={{ color: '#475569' }}>—</span>}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <ProbBar value={d.t4} color={COLORS.top4} />
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            {d.rel > 0 ? <ProbBar value={d.rel} color={COLORS.relegated} /> : <span style={{ color: '#475569' }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '12px 18px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[{c: COLORS.top4, l: 'Champions League'}, {c: COLORS.top6, l: 'Europa League'}, {c: COLORS.danger, l: 'Relegation Danger'}, {c: COLORS.relegated, l: 'Relegated'}].map(z => (
                  <span key={z.l} style={{ fontSize: 10, color: COLORS.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 3, background: z.c, borderRadius: 1 }} /> {z.l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ MONTE CARLO TAB ═══ */}
        {activeTab === 'montecarlo' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
              {/* Title Race */}
              <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 16px', color: COLORS.champion }}>🏆 Title Race</h3>
                {DATA.filter(d => d.ch > 0).sort((a, b) => b.ch - a.ch).map(d => (
                  <div key={d.t} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13 }}>{d.t}</span>
                      <span style={{ fontWeight: 700, color: COLORS.champion, fontSize: 15 }}>{d.ch}%</span>
                    </div>
                    <div style={{ height: 12, background: '#1e1b4b', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${d.ch}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.champion}, #f59e0b)`, borderRadius: 6, transition: 'width 0.8s ease' }} />
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>Predicted: {d.pp} pts (CI: {d.p5}–{d.p95})</div>
                  </div>
                ))}
              </div>

              {/* Top 4 */}
              <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 16px', color: COLORS.top4 }}>🏅 Top 4 Probabilities</h3>
                {DATA.filter(d => d.t4 > 1).sort((a, b) => b.t4 - a.t4).map(d => (
                  <div key={d.t} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: TEAM_COLORS[d.t], marginRight: 6 }} />
                        {d.t}
                      </span>
                      <span style={{ fontWeight: 700, color: COLORS.top4, fontSize: 13 }}>{d.t4}%</span>
                    </div>
                    <div style={{ height: 8, background: '#0c2d1b', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${d.t4}%`, height: '100%', background: COLORS.top4, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Relegation */}
              <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 16px', color: COLORS.relegated }}>⬇️ Relegation Probabilities</h3>
                {DATA.filter(d => d.rel > 0.5).sort((a, b) => b.rel - a.rel).map(d => (
                  <div key={d.t} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: TEAM_COLORS[d.t], marginRight: 6 }} />
                        {d.t}
                      </span>
                      <span style={{ fontWeight: 700, color: d.rel > 50 ? COLORS.relegated : COLORS.danger, fontSize: 14 }}>{d.rel}%</span>
                    </div>
                    <div style={{ height: 10, background: '#2d0c0c', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ width: `${d.rel}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.danger}, ${COLORS.relegated})`, borderRadius: 5 }} />
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>Current: {d.cp} pts · Predicted: {d.pp} pts</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attack vs Defense Scatter */}
            <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Attack vs Defense Strength</h3>
              <p style={{ fontSize: 11, color: COLORS.textMuted, margin: '0 0 16px' }}>Top-right = best teams (strong attack, strong defense). Size = predicted points.</p>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid stroke={COLORS.border} />
                  <XAxis dataKey="attack" name="Attack" type="number" domain={[0.5, 1.6]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} label={{ value: 'Attack Strength →', position: 'bottom', fill: COLORS.textMuted, fontSize: 11 }} />
                  <YAxis dataKey="defense" name="Defense" type="number" domain={[0.6, 1.4]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} label={{ value: '← Defense Strength', angle: -90, position: 'insideLeft', fill: COLORS.textMuted, fontSize: 11 }} />
                  <ReferenceLine x={1} stroke={COLORS.border} strokeDasharray="3 3" />
                  <ReferenceLine y={1} stroke={COLORS.border} strokeDasharray="3 3" />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                        <div style={{ fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>{d.name}</div>
                        <div style={{ color: COLORS.textMuted }}>ATK: {d.attack} · DEF: {d.defense} · Pred: {d.pts} pts</div>
                      </div>
                    );
                  }} />
                  <Scatter data={scatterData}>
                    {scatterData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ═══ TEAMS TAB ═══ */}
        {activeTab === 'teams' && (() => {
          const d = DATA.find(x => x.t === selectedTeam);
          if (!d) return null;
          return (
            <div>
              {/* Team selector */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {DATA.map(team => (
                  <button key={team.t} onClick={() => setSelectedTeam(team.t)} style={{
                    padding: '6px 12px', fontSize: 11, borderRadius: 6, border: `1px solid ${selectedTeam === team.t ? TEAM_COLORS[team.t] || COLORS.accent : COLORS.border}`,
                    background: selectedTeam === team.t ? `${TEAM_COLORS[team.t] || COLORS.accent}20` : 'transparent',
                    color: selectedTeam === team.t ? COLORS.text : COLORS.textMuted, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: selectedTeam === team.t ? 600 : 400
                  }}>{team.t}</button>
                ))}
              </div>

              {/* Team header */}
              <div style={{ background: `linear-gradient(135deg, ${TEAM_COLORS[selectedTeam] || COLORS.accent}30, ${COLORS.card})`, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>{selectedTeam}</h2>
                    <p style={{ color: COLORS.textMuted, margin: '6px 0 0', fontSize: 13 }}>
                      Predicted finish: <span style={{ color: getZoneColor(selectedTeam), fontWeight: 700 }}>#{d.pos}</span> · {d.pp} pts ({d.p5}–{d.p95} CI)
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Title', value: `${d.ch}%`, color: COLORS.champion },
                      { label: 'Top 4', value: `${d.t4}%`, color: COLORS.top4 },
                      { label: 'Releg', value: `${d.rel}%`, color: COLORS.relegated },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Inter, sans-serif' }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: COLORS.textMuted }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detail cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {/* Stats card */}
                <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Season Stats</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { l: 'Played', v: d.gp },
                      { l: 'Points', v: d.cp },
                      { l: 'Goals For', v: d.gf },
                      { l: 'Goals Against', v: d.ga },
                      { l: 'Goal Diff', v: `${d.gf - d.ga > 0 ? '+' : ''}${d.gf - d.ga}` },
                      { l: 'PPG', v: (d.cp / d.gp).toFixed(2) },
                      { l: 'Attack Rating', v: d.ar.toFixed(3) },
                      { l: 'Defense Rating', v: d.dr.toFixed(3) },
                    ].map(s => (
                      <div key={s.l}>
                        <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radar */}
                <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, margin: '0 0 8px', alignSelf: 'flex-start' }}>Strength Profile</h3>
                  <RadarChart team={selectedTeam} />
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>Overall Rating: {d.or.toFixed(2)} · BT: {d.bt.toFixed(1)}</div>
                </div>

                {/* Position distribution */}
                <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20, gridColumn: 'span 1' }}>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>Finish Position Distribution</h3>
                  <p style={{ fontSize: 10, color: COLORS.textMuted, margin: '0 0 8px' }}>From 10,000 Monte Carlo simulations</p>
                  <PositionDistChart team={selectedTeam} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ FIXTURES TAB ═══ */}
        {activeTab === 'fixtures' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12, marginBottom: 24 }}>
              {FIXTURES.map((f, i) => (
                <div key={i} style={{ background: COLORS.card, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13 }}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: TEAM_COLORS[f.h], marginRight: 4 }} />
                      {f.h}
                    </div>
                    <span style={{ fontSize: 10, color: COLORS.textMuted, padding: '2px 8px', background: `${COLORS.accent}15`, borderRadius: 4 }}>vs</span>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, textAlign: 'right' }}>
                      {f.a}
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: TEAM_COLORS[f.a], marginLeft: 4 }} />
                    </div>
                  </div>
                  
                  {/* Probability bar */}
                  <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ width: `${f.ph}%`, background: TEAM_COLORS[f.h] || COLORS.top4, transition: 'width 0.5s' }} />
                    <div style={{ width: `${f.pd}%`, background: COLORS.textMuted }} />
                    <div style={{ width: `${f.pa}%`, background: TEAM_COLORS[f.a] || COLORS.accent, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: COLORS.textMuted }}>
                    <span>{f.ph.toFixed(0)}% · xG {f.hx}</span>
                    <span>Draw {f.pd.toFixed(0)}%</span>
                    <span>xG {f.ax} · {f.pa.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Difficulty heatmap */}
            <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Remaining Fixture Difficulty</h3>
              <p style={{ fontSize: 11, color: COLORS.textMuted, margin: '0 0 16px' }}>Higher expected pts/game = easier remaining schedule</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={DATA.map(d => ({ name: d.t, exp: +(d.pp - d.cp).toFixed(1), remaining: d.gr })).sort((a, b) => b.exp - a.exp)} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid stroke={COLORS.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 10 }} label={{ value: 'Expected Points from Remaining Games', position: 'bottom', fill: COLORS.textMuted, fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: COLORS.text, fontSize: 11, fontFamily: 'Inter, sans-serif' }} width={95} />
                  <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} formatter={(v) => [`${v} pts`, 'Expected']} />
                  <Bar dataKey="exp" radius={[0, 4, 4, 0]}>
                    {DATA.map(d => ({ name: d.t, exp: +(d.pp - d.cp).toFixed(1) })).sort((a, b) => b.exp - a.exp).map((entry, i) => (
                      <Cell key={i} fill={entry.exp > 14 ? COLORS.top4 : entry.exp > 10 ? COLORS.accent : entry.exp > 7 ? COLORS.textMuted : COLORS.relegated} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 32px', borderTop: `1px solid ${COLORS.border}`, marginTop: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>Model: Dixon-Coles (ρ=-0.176) + Recency (HL=80) + Form (25%) + BT Ensemble · Acc: 51.2% · Beats Bet365</span>
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>Data: football-data.co.uk (301 matches) · SOT-xG proxy · Home adv: 1.13 · Log-loss: 1.010 (Bet365: 1.019)</span>
        </div>
      </div>
    </div>
  );
}
