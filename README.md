# TIBCO BusinessEvents® Samples

This repository is to add various samples/usecases using one or more features within TIBCO BusinessEvents. It will include samples contributed by TIBCO BusinessEvents team as well external users/customers/fields teams.

## Prerequisites

Below is the prerequites that is applicable to all the samples,

- Have the latest BusinessEvents version installed.

## Getting started

- Clone be-samples repo,
  
  git clone https://github.com/tibco/be-samples.git

- Building
  - Start BusinessEvent Studio located at <BE_HOME>/studio/eclipse/Studio
  - Import the sample you want to build via Import -> TIBCO BusinessEvents -> Existing TIBCO BusinessEvents Studio Project
  - Build Ear
 
- Running the sample
  - Open a command window and at the command prompt, `cd` into the `<PATH>` where the cdd and ear exist and start the TIBCO BusinessEvents engine using the following command. Substitute your actual value for <i>BE_HOME</i> and <i>PATH</i>.
    Adapt the below command as needed, for example, if you have customized the project and/or are running it from a different directory or have cdd and ear in different directories, etc.
  ```
    <BE_HOME>/bin/be-engine --propFile <BE_HOME>/bin/be-engine.tra -u default -c <sample>.cdd <sample>.ear
  ```
  - Finally open the sample specific readme.html in the browser and follow the steps.
   
  ## License
  This project is licensed under the BSD 3-Clause License. The full license text is available here.
