<?php

/**
 * @file
 * timetracking editing UI.
 *
 * We make very little use of the EntityAPI interface for this - preferring instead to use
 * views. That offers more flexibility to change a UI that will, more often than not,
 * be end-user facing.
 */
 
/**
 * UI controller.
 */
class timetrackingUIController extends EntityDefaultUIController {

  /**
   * Overrides hook_menu() defaults. Main reason for doing this is that
   * parent class hook_menu() is optimized for entity type administration.
   */
  public function hook_menu() {
    
    $items = array();
  
    
    // Add menu items to add a timetracking (no other bundles)
    $items['timetracking/add'] = array( //timetracking is the only bundle!
      'title' => 'Add timetracking',
      'page callback' => 'timetracking_form_wrapper',
      'page arguments' => array(timetracking_create(array('type' => 'timetracking'))),
      'access callback' => 'timetracking_access',
      'access arguments' => array('edit', 'create timetracking'),
      'file' => 'timetracking.admin.inc',
      'file path' => drupal_get_path('module', $this->entityInfo['module'])
    );

    // Loading and editing timetracking entities
    $items['timetracking/%timetracking/edit'] = array(
      'title' => 'Edit',      
      'page callback' => 'timetracking_form_wrapper',
      'page arguments' => array(1),
      'access callback' => 'timetracking_access',
      'access arguments' => array('edit', 1),
      'weight' => 0,
     // 'context' => MENU_CONTEXT_PAGE | MENU_CONTEXT_INLINE,
      'type' => MENU_LOCAL_TASK,
      'file' => 'timetracking.admin.inc',
      'file path' => drupal_get_path('module', $this->entityInfo['module']),
      'weight' => 1,
    );
   
    
    $items['timetracking/%timetracking/delete'] = array(
      'title' => 'Delete',
      'page callback' => 'timetracking_delete_form_wrapper',
      'page arguments' => array(1),
      'access callback' => 'timetracking_access',
      'access arguments' => array('edit', 1),
      'type' => MENU_CALLBACK,
      'context' => MENU_CONTEXT_INLINE,
      'weight' => 10,
      'file' => 'timetracking.admin.inc',
      'file path' => drupal_get_path('module', $this->entityInfo['module'])
    );
    
    
    return $items;
  }
  
  //prepare some form values bevor saving the entity
  public function entityFormSubmitBuildEntity($form, &$form_state) {
    $values = $form_state['values'];
    $time_start = $values['time_start'];
    $time_end = $values['time_end'];
    
    //date must be unix timestamp!
    $form_state['values']['time_start'] = strtotime($time_start);
    $form_state['values']['time_end'] = strtotime($time_end);
    
    entity_form_submit_build_entity($this->entityType, $form_state[$this->entityType], $form, $form_state);
    return $form_state[$this->entityType];
  }
  
  /**
   * Create the markup for the add timetracking Entities page within the class
   * so it can easily be extended/overriden.
   */ 
  public function addPage() {
    $item = menu_get_item();
    $content = system_admin_menu_block($item);

    if (count($content) == 1) {
      $item = array_shift($content);
      drupal_goto($item['href']);
    }    
        
    return theme('timetracking_add_list', array('content' => $content));
  }
  
}


/**
 * Form callback wrapper: create or edit a timetracking.
 *
 * @param $timetracking
 *   The timetracking object being edited by this form.
 *
 * @see timetracking_edit_form()
 */
function timetracking_form_wrapper($timetracking) {
  // Add the breadcrumb for the form's location.
  timetracking_set_breadcrumb();
  return drupal_get_form('timetracking_edit_form', $timetracking);
}

/**
 * Form callback wrapper: delete a timetracking.
 *
 * @param $timetracking
 *   The timetracking object being edited by this form.
 *
 * @see timetracking_edit_form()
 */
function timetracking_delete_form_wrapper($timetracking) {
  // Add the breadcrumb for the form's location.
  //timetracking_set_breadcrumb();
  return drupal_get_form('timetracking_delete_form', $timetracking);
}

/**
 * Form callback: create or edit a timetracking.
 *
 * @param $timetracking
 *   The timetracking object to edit or for a create form an empty timetracking object
 *     with only a timetracking type defined.
 */
function timetracking_edit_form($form, &$form_state, $timetracking) {
  // Add the default field elements.
  $form['timetracking_id'] = array(
    '#type' => 'value',
    '#value' => isset($timetracking->timetracking_id) ? $timetracking->timetracking_id : 0,
  );  

  $time_start = $timetracking->time_start ? $timetracking->time_start : time();
  $time_end = $timetracking->time_end;

  $format = _timetracking_get_date_format(true);
  $popup_default_format = 'Y-m-d H:i:s';
  
  $form['time_start'] = array(
    '#type' => 'date_popup',
    '#date_format' => $format,
    '#title' => t('Start time'),
    '#default_value' => $time_start ? date($popup_default_format, $time_start) : date($popup_default_format),
    '#required' => TRUE,
  );
  
  $form['time_end'] = array(
    '#type' => 'date_popup',
    '#date_format' => $format,
    '#title' => t('End time'),
    '#default_value' => $time_end ? date($popup_default_format, $time_end) : date($popup_default_format),
    '#required' => FALSE,
  );
  
  $form['duration'] = array(
    '#type' => 'textfield',
    '#title' => t('Duration'),
    '#default_value' => isset($timetracking->duration) ? round($timetracking->duration, 2) : 0,
    '#required' => FALSE,
  );
  
  $subjects = _timetracking_get_possible_timetracking_subjects();
  $subjects[0] = '';  

  $autcomplete_string = '';
  $subject_node = node_load($timetracking->subject_id);  //@TODO find a way to make this working with all entities
  if ($subject_node) {
    $autcomplete_string = _timetracking_make_autocomplete_string($subject_node->title, $subject_node->nid);
  }
  
  $form['subject_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Timetracking subject'),
    '#default_value' => isset($timetracking->subject_id) ? $autcomplete_string : 0,
    '#autocomplete_path' => 'timetracking/subject',
    '#description' => t('Please enter some keywords to find you subject to book the timetracking to.'),
    '#required' => FALSE,
  );
  
  $form['description'] = array(
    '#type' => 'textfield',
    '#title' => t('Timetracking description'),
    '#default_value' => isset($timetracking->description) && $timetracking->description ? $timetracking->description : '',
    '#required' => TRUE,
  );

  $form['data']['#tree'] = TRUE;

  // Add the field related form elements.
  $form_state['timetracking'] = $timetracking;
  field_attach_form('timetracking', $timetracking, $form, $form_state);

  $form['actions'] = array(
    '#type' => 'container',
    '#attributes' => array('class' => array('form-actions')),
    '#weight' => 400,
  );

  // We add the form's #submit array to this button along with the actual submit
  // handler to preserve any submit handlers added by a form callback_wrapper.
  $submit = array();

  if (!empty($form['#submit'])) {
    $submit += $form['#submit'];
  }

  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save timetracking'),
    '#submit' => $submit + array('timetracking_form_submit_button_submit'),
    '#validate' => array('timetracking_form_submit_button_validate'),
  );
  
  if (!empty($timetracking->timetracking_id)) {
    $destination = drupal_get_destination();
    $destination = $destination['destination'];
    $form['actions']['delete'] = array(
      '#type' => 'submit',
      '#value' => t('Delete timetracking'),
      '#suffix' => l(t('Cancel'), $destination),
      '#submit' => $submit + array('timetracking_form_submit_delete'),
      '#weight' => 45,
    );
  }

  return $form;
}

/**
 * Form API validate callback for the timetracking form
 */
function timetracking_form_submit_button_validate(&$form, &$form_state) {
  $timetracking = $form_state['timetracking'];
  
  $values = $form_state['values'];
  $time_start = strtotime($values['time_start']);
  $time_end = strtotime($values['time_end']);
  $duration = $values['duration'];
  
  //Validate that time start is not bigger or equal than time end
  if ($time_start >= $time_end && $time_end)
    form_set_error('time_end', t('Time end hours must be less than time start'));

  $calculated_duration = false;
  if ($time_start && $time_end)
    $calculated_duration = round(($time_end - $time_start) / (60*60), 2);

  //allow only numbers in total_hours field
  if ($duration && $calculated_duration) {
    //respect a small difference as the calculation of strtotime may cut some seconds, which could result in difference of about 0.02
    $diff = abs($duration - $calculated_duration);
    if ($diff > 0.02) {
      form_set_error('duration', t('Duration is not equal with difference of start and end time'));
    }
  }
  
  //validate that the selected subject can really be refernced
  $subject_string = $values['subject_id'];
  $is_valid = _timetracking_check_subject_autocomplete_string($subject_string);
  
  if (!$is_valid) {
    form_set_error('subject_id', t('This subject is not allowed to be referenced'));
  }
  
  // Notify field widgets to validate their data.
  field_attach_form_validate('timetracking', $timetracking, $form, $form_state);
}

/**
 * checks if the autocomplete string is valid
 */
function _timetracking_check_subject_autocomplete_string($subject_string) {
  
  $nid = _timetracking_get_nid_from_autocomplete_string($subject_string);

  //@TODO this works only for nodes right now. Better solution needed to work with entities in general
  $node = node_load($nid);
  
  if (!$node || !($node->nid == $nid && isset($node->title) && $node->title)) {
    return false;
  } else {    
    $new_string = _timetracking_make_autocomplete_string($node->title, $node->nid);
    if ($new_string != $subject_string) {
      return false;
    }
    
    //has user access?
    if (!node_access('view', $node))
      return false;
  }
  
  return true;
}

/**
 * creates an autocomplete string
 */
function _timetracking_make_autocomplete_string($text, $id) {
  return $text." (".$id.")";
}

/**
 * Form API submit callback for the timetracking form.
 * 
 */
function timetracking_form_submit_button_submit(&$form, &$form_state) {
 
  $values = $form_state['values'];
  $subject_string = $values['subject_id'];
  $nid = _timetracking_get_nid_from_autocomplete_string($subject_string);
  $form_state['values']['subject_id'] = $nid;
  
  $timetracking = entity_ui_controller('timetracking')->entityFormSubmitBuildEntity($form, $form_state);
  // Save the timetracking and go back to the list of timetrackings
  
  // Add in created and changed times.
  if ($timetracking->is_new = isset($timetracking->is_new) ? $timetracking->is_new : 0){
    $timetracking->created = time();    
  }
  // default user on timetracking/add page is not registered so we add it (again)
  global $user;
  $timetracking->uid = $user->uid;

  $timetracking->changed = time();    
  $timetracking->save();
  
  drupal_set_message(t('The timetracking has been saved.'));
}

/**
 * Form API submit callback for the delete button.
 * 
 * @todo Remove hard-coded path
 */
function timetracking_form_submit_delete(&$form, &$form_state) {
  $timetracking = entity_ui_controller('timetracking')->entityFormSubmitBuildEntity($form, $form_state);
  $destination = drupal_get_destination();
  $destination = $destination['destination'];

  $url = url('timetracking/'.$timetracking->timetracking_id.'/delete', array('query' => array('destination' => $destination)));
  header('Location: ' . $url, TRUE, 302);
  exit(0);
}


/**
 * Form callback: confirmation form for deleting a timetracking.
 *
 * @param $timetracking
 *   The timetracking to delete
 *
 * @see confirm_form()
 */
function timetracking_delete_form($form, &$form_state, $timetracking) {
  $form_state['timetracking'] = $timetracking;

  $form['#submit'][] = 'timetracking_delete_form_submit';

  $form = confirm_form($form,
    t('Are you sure you want to delete timetracking %subject?', array('%subject' => $timetracking->defaultLabel())),
    'timetracking/'.$timetracking->timetracking_id,
    '<p>' . t('This action cannot be undone.') . '</p>',
    t('Delete'),
    t('Cancel'),
    'confirm'
  );
  
  return $form;
}

/**
 * Submit callback for timetracking_delete_form
 */
function timetracking_delete_form_submit($form, &$form_state) {
  $timetracking = $form_state['timetracking'];

  $result = timetracking_delete($timetracking);
 
  drupal_set_message(t('The timetracking %subject has been deleted.', array('%subject' => $timetracking->defaultLabel())));
  watchdog('timetracking', 'Deleted timetracking %subject.', array('%subject' => $timetracking->defaultLabel()));
  
  $form_state['redirect'] = '';
}



/**
 * Page to add timetracking Entities.
 *
 * @todo Pass this through a proper theme function
 */
function timetracking_add_page() {
  $controller = entity_ui_controller('timetracking');
  return $controller->addPage();
}


/**
 * Displays the list of available timetracking types for timetracking creation.
 *
 * @ingroup themeable
 */
function theme_timetracking_add_list($variables) {
  $content = $variables['content'];
  $output = '';
  if ($content) {
    $output = '<dl class="timetracking-type-list">';
    foreach ($content as $item) {
      $output .= '<dt>' . l($item['title'], $item['href']) . '</dt>';
      $output .= '<dd>' . filter_xss_admin($item['description']) . '</dd>';
    }
    $output .= '</dl>';
  }
  else {
    if (user_access('administer timetracking types')) {
      $output = '<p>' . t('timetracking Entities cannot be added because you have not created any timetracking types yet. Go to the <a href="@create-timetracking-type">timetracking type creation page</a> to add a new timetracking type.', array('@create-timetracking-type' => url('admin/structure/timetracking_types/add'))) . '</p>';
    }
    else {
      $output = '<p>' . t('No timetracking types have been created yet for you to use.') . '</p>';
    }
  }

  return $output;
}

/**
 * Sets the breadcrumb for administrative timetracking pages.
 */
function timetracking_set_breadcrumb() {
  $breadcrumb = array(
    l(t('Home'), '<front>'),
    l(t('Administration'), 'admin'),
    l(t('Content'), 'admin/content'),
    l(t('timetrackings'), 'timetrackings'),
  );

  drupal_set_breadcrumb($breadcrumb);
}

