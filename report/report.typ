#set document(
  title: "The Shape of Sound: A Practice-Led Study in Creative Human-Computer Interaction",
  author: "Oliver Bryan",
)

#set page(
  paper: "a4",
  margin: (x: 3cm, y: 2.5cm),
)

#set text(
  font: "Times New Roman",
  size: 12pt,
)
#let bib = bibliography("bibliography.bib")

#align(center)[
  #text(size: 18pt)[
    6COSC023W
    \
    Computer Science Final Project
    \
    
    Final Year Project (FYP) - Report
  ]
  \
  
  #text(size: 28pt, weight: "bold")[The Shape of Sound: A Practice-Led Study in Creative Human-Computer Interaction]
  \
  
  #text(size:18pt)[
    #text(weight: "bold")[Student: ]Oliver Bryan (w1980003)
    
    #text(weight: "bold")[Supervisor: ] Andrea Martina
    
    #text(weight: "bold")[Degree: ] BEng Software Engineering
    
    School of Computer Science & Engineering
    \
    University of Westminster
    \
    2026
  ]
]

#pagebreak()

#import "chapters/declaration.typ": declaration
#import "chapters/abstract.typ": abstract
#import "chapters/acknowledgements.typ": acknowledgements
#import "chapters/list_of_figures.typ": list_of_figures
#import "chapters/list_of_tables.typ": list_of_tables
#import "chapters/intro.typ": intro
#import "chapters/background.typ": background
#import "chapters/legal_social_sustainability_and_ethical_issues.typ": legal_social_sustainability_and_ethical_issues
#import "chapters/methodology.typ": methodology
#import "chapters/design.typ": design
#import "chapters/tools_and_implementation.typ": tools_and_implementation
#import "chapters/testing.typ": testing
#import "chapters/conclusions_and_reflections.typ": conclusions_and_reflections

#declaration
#abstract
#acknowledgements

#outline()
#pagebreak()

#list_of_figures
#list_of_tables

#set heading(
  numbering: "1.1",
)

#intro
#background
#legal_social_sustainability_and_ethical_issues
#methodology
#design
#tools_and_implementation
#testing
#conclusions_and_reflections

#bibliography("bibliography.bib")
