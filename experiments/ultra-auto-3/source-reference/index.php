<?php
defined('_JEXEC') or die;
require_once __DIR__.'/factory-v2/Adapter.php';
$factoryHtml=\UsaFactoryV2\Adapter::render();if($factoryHtml!==null){echo $factoryHtml;return;}
require_once JPATH_THEMES.'/ultraserviceauto/src/Rc1Gate.php';
if (UsaRc1Gate::active()) { require __DIR__.'/index-rc1-active.php'; return; }
require __DIR__.'/index-rc1-legacy.php';
