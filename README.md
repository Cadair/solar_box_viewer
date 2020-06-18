Simple solar context plotter
=====================================

The idea of this is to show a rectangular region specified in helioprojective cartesian coordinates in a Representative location on the solar disk.
The motivating use case is to is to display the location of an observation to the user in a search portal or similar site.


Assumptions
-------------

1. We make the small angle approximation and ignore any projection effects when converting from HPC.
1. We assume that all the rectangles being displayed are from the same observer location in inertial space. (This therefore means taken at a single time for observers on the Earth, as no accounting can be done for the orbit of the Earth)


Implementation
-----------------

The canvas on which the solar limb and the rectangles are drawn is converted into a coordinate system of fractions of the angular solar radius.
The angular radius to use can be specified but defaults to the angular radius at 1AU.
