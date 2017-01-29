# Random thoughts and ideas for Meter & Music AI tools

## Measurements
Ideas for measurements on pieces of music. How can each measurement be made? What are the values for qualitative measurements such as energy or mood?
* Qualitative
    * Energy
        * Intense
        * Peaceful
        * Relaxed
        * Calm
        * Dreamy
        * Meandering
    * Feel
        * Rigid
        * Loose
        * Upbeat
        * Driving
        * Busy

Quantative 
    * Power - How hard hitting is the piece of music. Variance in dynamic range?
    * Complexity - Variance between notes, time signatures, key signatures, tempo shifts.
    * Density - Example: Are there many short 32nd notes or long whole notes.
    * Variance - A general property measured along various axes.
    * Uniformity - How uniform are the notes of the instruments? Do the notes of each instrument tend to land in the same places in time? What is the variance of notes in the time domain?

## Algorithm Analysis Tools and Visualizations
Example: A tool that allowed your to compose a melody for a single instrument with real-time feedback as to how that melody was being interpretted by the learning algorithms. Visual feedback for a property like complexity/simplicity or density could be really cool.


## Data Service API
### file-system- fetch
Enables browsing through thousands of files, much like a desktop file-system

### put-file-system-upload
Allows the upload of one or more files. Catalogs the file(s), stores meta data, classifies and runs analysis jobs on uploaded files.

### get-file-meta-data
Returns the meta-data for one or more file

### get-alike
Returns files similar to the specified file(s). Allows specific axis to be used as predicate for result.

*...more to come*

## Search
A domain specific query language that enables making the above requests and more through an in browser text input. This tool could live in the tool panel and consist of something in between a command line interface and a file browser. 
