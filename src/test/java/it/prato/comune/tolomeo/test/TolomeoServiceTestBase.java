package it.prato.comune.tolomeo.test;

import it.geosolutions.geostore.core.model.Category;
import it.geosolutions.geostore.core.model.Resource;
import it.geosolutions.geostore.core.model.StoredData;
import it.geosolutions.geostore.services.CategoryService;
import it.geosolutions.geostore.services.ResourceService;
import it.geosolutions.geostore.services.StoredDataService;
import it.geosolutions.geostore.services.dto.ShortResource;
import it.geosolutions.geostore.services.exception.BadRequestServiceEx;
import it.geosolutions.geostore.services.exception.NotFoundServiceEx;

import java.util.List;

import junit.framework.TestCase;

import org.apache.log4j.Logger;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Class TolomeoServiceTestBase.
 * 
 * @author Tobia di Pisa (tobia.dipisa at geo-solutions.it)
 * 
 */
public class TolomeoServiceTestBase extends TestCase {

    protected static StoredDataService storedDataService;

    protected static ResourceService resourceService;

    protected static CategoryService categoryService;

    protected static ClassPathXmlApplicationContext ctx = null;

    protected final Logger LOGGER = Logger.getLogger(getClass());

    /**
     *
     */
    public TolomeoServiceTestBase() {
        synchronized (TolomeoServiceTestBase.class) {
            if (ctx == null) {
                String[] paths = { 
            		"classpath*:applicationContext.xml"
                };
                
                ctx = new ClassPathXmlApplicationContext(paths);

                storedDataService = (StoredDataService) ctx.getBean("storedDataService");
                resourceService = (ResourceService) ctx.getBean("resourceService");
                categoryService = (CategoryService) ctx.getBean("categoryService");
            }
        }
    }

    /*
     * (non-Javadoc) @see junit.framework.TestCase#setUp()
     */
    @Override
    protected void setUp() throws Exception {
        LOGGER.info("################ Running " + getClass().getSimpleName() + "::" + getName());
        super.setUp();
        removeAll();
    }

    /**
     *
     */
    public void testCheckServices() {
        assertNotNull(storedDataService);
        assertNotNull(resourceService);
        assertNotNull(categoryService);
    }

    /**
     * @throws NotFoundServiceEx
     * @throws BadRequestServiceEx
     */
    protected void removeAll() throws NotFoundServiceEx, BadRequestServiceEx {
        LOGGER.info("***** removeAll()");
        removeAllResource();
        removeAllStoredData();
        removeAllCategory();
    }

    /**
     * @throws BadRequestServiceEx
     */
    private void removeAllCategory() throws BadRequestServiceEx {
        List<Category> list = categoryService.getAll(null, null);
        for (Category item : list) {
            LOGGER.info("Removing " + item);

            boolean ret = categoryService.delete(item.getId());
            assertTrue("Category not removed", ret);
        }

        assertEquals("Category have not been properly deleted", 0, categoryService.getCount(null));
    }

    /**
     * @throws NotFoundServiceEx
     */
    protected void removeAllStoredData() throws NotFoundServiceEx {
        List<StoredData> list = storedDataService.getAll();
        for (StoredData item : list) {
            LOGGER.info("Removing " + item);

            boolean ret = storedDataService.delete(item.getId());
            assertTrue("Data not removed", ret);
        }
    }

    /**
     * @throws BadRequestServiceEx
     * 
     */
    private void removeAllResource() throws BadRequestServiceEx {
        List<ShortResource> list = resourceService.getAll(null, null, null);
        for (ShortResource item : list) {
            LOGGER.info("Removing " + item);

            boolean ret = resourceService.delete(item.getId());
            assertTrue("Resource not removed", ret);
        }

        assertEquals("Resource have not been properly deleted", 0, resourceService.getCount(null));
    }

    /**
     * @param name
     * @param data
     * @return long
     * @throws Exception
     */
    protected long createData(String data, Resource resource) throws Exception {
        return storedDataService.update(resource.getId(), data);
    }

    /**
     * @param name
     * @param creation
     * @param description
     * @param storedData
     * @return long
     * @throws Exception
     */
    protected long createResource(String name, String description, String catName) throws Exception {

        Category category = new Category();
        category.setName(catName);

        categoryService.insert(category);

        Resource resource = new Resource();
        resource.setName(name);
        resource.setDescription(description);
        resource.setCategory(category);

        return resourceService.insert(resource);
    }

    /**
     * @param name
     * @return long
     * @throws Exception
     */
    protected long createCategory(String name) throws Exception {
        Category category = new Category();
        category.setName(name);

        return categoryService.insert(category);
    }

}
